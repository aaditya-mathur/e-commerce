import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";

export const fetchAllProducts = async () => {
  try {
    const allProducts = await Product.find({}).lean();
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

export const createNewProduct = async (
  name,
  description,
  price,
  image,
  category
) => {
  try {
    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
    });
    return product;
  } catch (error) {
    console.error("error while creating new product", error.message);
    throw new ApiError(500, "could not create new product");
  }
};

export const findProductById = async (productId) => {
  try {
    const existingProduct = await Product.findById(productId);
    return existingProduct;
  } catch (error) {
    console.error("error while getting product by id");
    throw new ApiError(500, "could not find product");
  }
};

export const deleteExistingProduct = async (productId) => {
  try {
    const existingProduct = await Product.findByIdAndDelete(productId);
    if (existingProduct) {
      return;
    }
    throw new ApiError(404, "could not find product");
  } catch (error) {
    console.error("error while deleting product");
    throw new ApiError(500, "could not delete product");
  }
};

export const fetchRecommendedProducts = async () => {
  try {
    const recommendedProducts = await Product.aggregate([
      {
        $sample: {
          size: 3,
        },
      },
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
  } catch (error) {
    console.error("error while fetching recommend products");
    throw new ApiError(500, "could not get recommended products");
  }
};

export const fetchProductsByCategory = async (category) => {
  try {
    const products = await Product.find({
      category,
    }).lean();
    return products;
  } catch (error) {
    console.error("error while fetching products by category");
    throw new ApiError(500, "could not fetch product by category");
  }
};