import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

export const fetchAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    return allProducts;
  } catch (error) {
    console.error("error while fetching the products", error.message);
    throw new ApiError(500, "could not fetch products");
  }
};

export const fetchFeaturedProducts = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    return featuredProducts;
  } catch (error) {
    console.error("error while fetching featured products", error.message);
    throw new ApiError(500, "could not fetch featured products");
  }
};
