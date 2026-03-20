import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { ContactQuery } from '../models/ContactQuery.js';
import { CallBooking } from '../models/CallBooking.js';
import { ProductInquiry } from '../models/ProductInquiry.js';
import { formatCategory, formatProduct, formatUser } from '../utils/formatters.js';

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatContactQuery = (query) => ({
  id: query._id.toString(),
  name: query.name,
  email: query.email,
  phone: query.phone,
  subject: query.subject,
  message: query.message,
  status: query.status,
  created_at: query.createdAt.toISOString(),
});

const formatCallBooking = (booking) => ({
  id: booking._id.toString(),
  name: booking.name,
  email: booking.email,
  phone: booking.phone,
  preferred_date: booking.preferredDate,
  preferred_time: booking.preferredTime,
  message: booking.message,
  status: booking.status,
  created_at: booking.createdAt.toISOString(),
});

const formatProductInquiry = (inquiry) => ({
  id: inquiry._id.toString(),
  name: inquiry.name,
  email: inquiry.email,
  phone: inquiry.phone,
  inquiry_type: inquiry.inquiryType,
  message: inquiry.message,
  status: inquiry.status,
  created_at: inquiry.createdAt.toISOString(),
  product: inquiry.productId
    ? {
        id: inquiry.productId._id.toString(),
        name: inquiry.productId.name,
      }
    : null,
});

const formatAdminUser = (user) => ({
  ...formatUser(user),
  created_at: user.createdAt.toISOString(),
});

export const getDashboardData = async (_req, res) => {
  const [
    totalProducts,
    totalCategories,
    totalUsers,
    pendingContactQueries,
    pendingCallBookings,
    pendingProductInquiries,
    users,
    categories,
    products,
    contactQueries,
    callBookings,
    productInquiries,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    User.countDocuments(),
    ContactQuery.countDocuments({ status: { $ne: 'resolved' } }),
    CallBooking.countDocuments({ status: { $ne: 'completed' } }),
    ProductInquiry.countDocuments({ status: { $ne: 'closed' } }),
    User.find().sort({ createdAt: -1 }).limit(20),
    Category.find().sort({ createdAt: 1 }),
    Product.find().populate('categoryId').sort({ createdAt: -1 }),
    ContactQuery.find().sort({ createdAt: -1 }),
    CallBooking.find().sort({ createdAt: -1 }),
    ProductInquiry.find().populate('productId').sort({ createdAt: -1 }),
  ]);

  res.json({
    summary: {
      totalProducts,
      totalCategories,
      totalUsers,
      pendingContactQueries,
      pendingCallBookings,
      pendingProductInquiries,
    },
    users: users.map(formatAdminUser),
    categories: categories.map(formatCategory),
    products: products.map(formatProduct),
    contactQueries: contactQueries.map(formatContactQuery),
    callBookings: callBookings.map(formatCallBooking),
    productInquiries: productInquiries.map(formatProductInquiry),
  });
};

export const createCategory = async (req, res) => {
  const { name, slug, description, imageUrl } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const nextSlug = slugify(slug || name);

  if (!nextSlug) {
    return res.status(400).json({ message: 'A valid category slug is required.' });
  }

  const existing = await Category.findOne({ slug: nextSlug });
  if (existing) {
    return res.status(409).json({ message: 'A category with this slug already exists.' });
  }

  const category = await Category.create({
    name: name.trim(),
    slug: nextSlug,
    description: description?.trim() || null,
    imageUrl: imageUrl?.trim() || null,
  });

  res.status(201).json({ category: formatCategory(category), message: 'Category created successfully.' });
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, slug, description, imageUrl } = req.body;
  const category = await Category.findById(categoryId);

  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  const nextSlug = slugify(slug || name || category.slug);

  if (!name?.trim() || !nextSlug) {
    return res.status(400).json({ message: 'Category name and slug are required.' });
  }

  const existing = await Category.findOne({ slug: nextSlug, _id: { $ne: category._id } });
  if (existing) {
    return res.status(409).json({ message: 'A category with this slug already exists.' });
  }

  category.name = name.trim();
  category.slug = nextSlug;
  category.description = description?.trim() || null;
  category.imageUrl = imageUrl?.trim() || null;
  await category.save();

  res.json({ category: formatCategory(category), message: 'Category updated successfully.' });
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const linkedProducts = await Product.countDocuments({ categoryId });

  if (linkedProducts > 0) {
    return res.status(400).json({ message: 'Remove or reassign products before deleting this category.' });
  }

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  res.json({ message: 'Category deleted successfully.' });
};

export const createProduct = async (req, res) => {
  const { name, description, price, weightGrams, purity, categoryId, imageUrl, isFeatured, isAvailable } = req.body;

  if (!name?.trim() || price === undefined || Number.isNaN(Number(price))) {
    return res.status(400).json({ message: 'Product name and valid price are required.' });
  }

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
  }

  const product = await Product.create({
    name: name.trim(),
    description: description?.trim() || null,
    price: Number(price),
    weightGrams: weightGrams === '' || weightGrams === undefined || weightGrams === null ? null : Number(weightGrams),
    purity: purity?.trim() || null,
    categoryId: categoryId || null,
    imageUrl: imageUrl?.trim() || null,
    isFeatured: Boolean(isFeatured),
    isAvailable: isAvailable ?? true,
  });

  await product.populate('categoryId');

  res.status(201).json({ product: formatProduct(product), message: 'Product created successfully.' });
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, weightGrams, purity, categoryId, imageUrl, isFeatured, isAvailable } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  if (!name?.trim() || price === undefined || Number.isNaN(Number(price))) {
    return res.status(400).json({ message: 'Product name and valid price are required.' });
  }

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
  }

  product.name = name.trim();
  product.description = description?.trim() || null;
  product.price = Number(price);
  product.weightGrams = weightGrams === '' || weightGrams === undefined || weightGrams === null ? null : Number(weightGrams);
  product.purity = purity?.trim() || null;
  product.categoryId = categoryId || null;
  product.imageUrl = imageUrl?.trim() || null;
  product.isFeatured = Boolean(isFeatured);
  product.isAvailable = Boolean(isAvailable);
  await product.save();
  await product.populate('categoryId');

  res.json({ product: formatProduct(product), message: 'Product updated successfully.' });
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ message: 'Product deleted successfully.' });
};

export const updateContactQueryStatus = async (req, res) => {
  const { queryId } = req.params;
  const { status } = req.body;

  if (!['new', 'in_progress', 'resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid contact query status.' });
  }

  const query = await ContactQuery.findByIdAndUpdate(queryId, { status }, { new: true });
  if (!query) {
    return res.status(404).json({ message: 'Contact query not found.' });
  }

  res.json({ message: 'Contact query updated successfully.', query: formatContactQuery(query) });
};

export const updateCallBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid call booking status.' });
  }

  const booking = await CallBooking.findByIdAndUpdate(bookingId, { status }, { new: true });
  if (!booking) {
    return res.status(404).json({ message: 'Call booking not found.' });
  }

  res.json({ message: 'Call booking updated successfully.', booking: formatCallBooking(booking) });
};

export const updateProductInquiryStatus = async (req, res) => {
  const { inquiryId } = req.params;
  const { status } = req.body;

  if (!['pending', 'contacted', 'closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid product inquiry status.' });
  }

  const inquiry = await ProductInquiry.findByIdAndUpdate(inquiryId, { status }, { new: true }).populate('productId');
  if (!inquiry) {
    return res.status(404).json({ message: 'Product inquiry not found.' });
  }

  res.json({ message: 'Product inquiry updated successfully.', inquiry: formatProductInquiry(inquiry) });
};
