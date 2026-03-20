export const formatUser = (user) => ({
  id: user._id.toString(),
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
});

export const formatCategory = (category) => ({
  id: category._id.toString(),
  name: category.name,
  slug: category.slug,
  description: category.description,
  image_url: category.imageUrl,
});

export const formatProduct = (product) => ({
  id: product._id.toString(),
  name: product.name,
  description: product.description,
  price: product.price,
  weight_grams: product.weightGrams,
  purity: product.purity,
  image_url: product.imageUrl,
  is_featured: product.isFeatured,
  is_available: product.isAvailable,
  category_id: product.categoryId?._id ? product.categoryId._id.toString() : product.categoryId?.toString() || null,
  category: product.categoryId?._id
    ? {
        id: product.categoryId._id.toString(),
        name: product.categoryId.name,
        slug: product.categoryId.slug,
      }
    : null,
});
