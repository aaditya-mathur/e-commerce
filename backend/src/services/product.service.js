import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

export const fetchAllProducts = async () => {
  const allProducts = await Product.find({}).lean();
  return allProducts;
};

export const fetchFeaturedProducts = async () => {
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return featuredProducts;
};

export const createNewProduct = async (
  name,
  description,
  price,
  image,
  category
) => {
  const product = await Product.create({
    name,
    description,
    price,
    image,
    category,
  });
  return product;
};

export const findProductById = async (productId) => {
  const existingProduct = await Product.findById(productId);
  return existingProduct;
};

export const deleteExistingProduct = async (productId) => {
  const existingProduct = await Product.findByIdAndDelete(productId);
  if (!existingProduct) {
    throw new ApiError(404, "product not found");
  }
  return existingProduct;
};

export const fetchRecommendedProducts = async () => {
  const recommendedProducts = await Product.aggregate([
    { $sample: { size: 3 } },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        price: 1,
        image: 1,
      },
    },
  ]);
  return recommendedProducts;
};

export const fetchProductsByCategory = async (category) => {
  const products = await Product.find({ category }).lean();
  return products;
};