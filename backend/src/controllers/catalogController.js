import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { formatCategory, formatProduct } from '../utils/formatters.js';

export const getCategories = async (_req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json({ categories: categories.map(formatCategory) });
};

export const getProducts = async (req, res) => {
  const { category, featured } = req.query;
  const filter = { isAvailable: true };

  if (featured === 'true') {
    filter.isFeatured = true;
  }

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });

    if (!categoryDoc) {
      return res.json({ products: [] });
    }

    filter.categoryId = categoryDoc._id;
  }

  const products = await Product.find(filter)
    .populate('categoryId')
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({ products: products.map(formatProduct) });
};
