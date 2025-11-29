import { Product } from "../models/product.model.js";
import {
  fetchAllProducts,
  fetchFeaturedProducts,
  createNewProduct,
  findProductById,
  deleteExistingProduct,
  fetchRecommendedProducts,
  fetchProductsByCategory,
} from "../services/product.service.js";
import {
  ApiResponse,
  redis,
  asyncHandler,
  cloudinary,
  ApiError,
} from "../utils/utils.index.js";
import { createProductPostRequestBodySchema } from "../validations/request.validation.js";

// TO GET ALL THE PRODUCTS (ADMIN ONLY)
export const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await fetchAllProducts();
  return res
    .status(200)
    .json(new ApiResponse(200, "products fetched successfully", allProducts));
});

// TO GET ALL THE FEATURED PRODUCTS
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  let featuredProducts = await redis.get("featured_products");

  if (featuredProducts) {
    return res
      .status(200)
      .json(new ApiResponse(200, "success", JSON.parse(featuredProducts)));
  }

  featuredProducts = await fetchFeaturedProducts();

  await redis.set(
    "featured_products",
    JSON.stringify(featuredProducts),
    "EX",
    2 * 60 * 60
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "featured products successfully fetched",
        featuredProducts
      )
    );
});

// TO CREATE NEW PRODUCT
export const createProduct = asyncHandler(async (req, res) => {
  const validationResult =
    await createProductPostRequestBodySchema.safeParseAsync(req.body);

  if (validationResult.error) {
    throw new ApiError(
      400,
      "validation failed",
      validationResult.error.format()
    );
  }

  const { name, description, price, image, category } = validationResult.data;

  const cloudinaryResponse = await cloudinary.uploader.upload(image, {
    folder: "products",
  });

  const uploadedImage = cloudinaryResponse?.secure_url;

  if (!uploadedImage) {
    throw new ApiError(500, "failed to upload image try again");
  }

  const product = await createNewProduct(
    name,
    description,
    price,
    uploadedImage,
    category
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "product created successfully", product));
});

// TO DELETE NEW PRODUCT
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const existingProduct = await findProductById(id);

  if (!existingProduct) {
    throw new ApiError(404, "product does not exist");
  }

  const publicId = existingProduct.image.split("/").pop().split(".")[0];

  try {
    await cloudinary.uploader.destroy(`products/${publicId}`);
    console.log("image deleted from cloudinary");
  } catch (error) {
    throw new ApiError(500, "error deleting image from cloudinary");
  }

  await deleteExistingProduct(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "product deleted successfully"));
});

// TO GET RECOMMENDED PRODUCTS
export const getRecommendedProducts = asyncHandler(async (req, res) => {
  const recommendedProducts = await fetchRecommendedProducts();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "products fetched successfully", recommendedProducts)
    );
});

// TO GET PRODUCTS CATEGORICALLY
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;

  const products = await fetchProductsByCategory(category);
  return res
    .status(200)
    .json(new ApiResponse(200, "products fetched successfully", products));
});

// TO TOGGLE FEATURED PRODUCTS
export const toggleFeaturedProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const existingProduct = await findProductById(id);

  existingProduct.isFeatured = !existingProduct.isFeatured;

  const updatedProduct = await existingProduct.save();

  await updateFeaturedProductsCache();
  return res
    .status(200)
    .json(new ApiResponse(200, "product updated successfully", updatedProduct));
});

// FOR UPDATING STORED FEATURED PRODUCTS IN CACHE
async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await fetchFeaturedProducts();
    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      "EX",
      2 * 60 * 60
    );
  } catch (error) {
    console.error("error in updating featured products cache");
    throw new ApiError(500, "error while updating featured products cache");
  }
};