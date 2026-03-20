import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { sampleCategories, sampleProducts } from '../data/catalogSeed.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

export const seedDatabase = async () => {
  if ((await Category.countDocuments()) === 0) {
    await Category.insertMany(sampleCategories);
  }

  if ((await Product.countDocuments()) === 0) {
    const categories = await Category.find();
    const categoryMap = new Map(categories.map((category) => [category.slug, category._id]));

    await Product.insertMany(
      sampleProducts.map(([name, description, price, weightGrams, purity, categorySlug, imageUrl, isFeatured]) => ({
        name,
        description,
        price,
        weightGrams,
        purity,
        categoryId: categoryMap.get(categorySlug) || null,
        imageUrl,
        isFeatured,
      })),
    );
  }

  const normalizedAdminEmail = env.adminEmail.toLowerCase().trim();
  const adminPasswordHash = await bcrypt.hash(env.adminPassword, 10);
  const existingAdminByEmail = await User.findOne({ email: normalizedAdminEmail });

  if (existingAdminByEmail) {
    existingAdminByEmail.fullName = env.adminName;
    existingAdminByEmail.role = 'admin';
    existingAdminByEmail.passwordHash = adminPasswordHash;
    await existingAdminByEmail.save();
    return;
  }

  const existingAdmin = await User.findOne({ role: 'admin' });

  if (!existingAdmin) {
    await User.create({
      fullName: env.adminName,
      email: normalizedAdminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin',
    });
  }
};
