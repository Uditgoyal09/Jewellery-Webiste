import { sampleCategories, sampleProducts } from '../data/catalogSeed.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

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
};
