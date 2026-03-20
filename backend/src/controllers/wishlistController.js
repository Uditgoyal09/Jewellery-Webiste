import { Product } from '../models/Product.js';
import { Wishlist } from '../models/Wishlist.js';
import { formatProduct } from '../utils/formatters.js';

export const getWishlist = async (req, res) => {
  const entries = await Wishlist.find({ userId: req.user._id }).populate({
    path: 'productId',
    populate: { path: 'categoryId' },
  });

  const products = entries
    .map((entry) => entry.productId)
    .filter(Boolean)
    .map(formatProduct);

  res.json({
    products,
    productIds: products.map((product) => product.id),
  });
};

export const addToWishlist = async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  await Wishlist.updateOne(
    { userId: req.user._id, productId: product._id },
    { $setOnInsert: { userId: req.user._id, productId: product._id } },
    { upsert: true },
  );

  res.status(201).json({ message: 'Added to wishlist.' });
};

export const removeFromWishlist = async (req, res) => {
  await Wishlist.deleteOne({ userId: req.user._id, productId: req.params.productId });
  res.json({ message: 'Removed from wishlist.' });
};
