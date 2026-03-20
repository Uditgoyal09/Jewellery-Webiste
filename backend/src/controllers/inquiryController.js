import { ContactQuery } from '../models/ContactQuery.js';
import { CallBooking } from '../models/CallBooking.js';
import { ProductInquiry } from '../models/ProductInquiry.js';
import { Product } from '../models/Product.js';

export const createContactQuery = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  await ContactQuery.create({ name, email, phone, subject, message });
  res.status(201).json({ message: 'Message received.' });
};

export const createCallBooking = async (req, res) => {
  const { name, email, phone, preferredDate, preferredTime, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required.' });
  }

  await CallBooking.create({
    userId: req.user?._id || null,
    name,
    email,
    phone,
    preferredDate: preferredDate || null,
    preferredTime: preferredTime || null,
    message: message || null,
  });

  res.status(201).json({ message: 'Call booked successfully.' });
};

export const createProductInquiry = async (req, res) => {
  const { productId, name, email, phone, inquiryType, message } = req.body;

  if (!productId || !name || !email || !inquiryType || !message) {
    return res
      .status(400)
      .json({ message: 'Product, name, email, inquiry type, and message are required.' });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  await ProductInquiry.create({
    userId: req.user?._id || null,
    productId: product._id,
    name,
    email,
    phone,
    inquiryType,
    message,
  });

  res.status(201).json({ message: 'Inquiry submitted successfully.' });
};
