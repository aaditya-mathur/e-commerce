import {
  fetchAllProducts,
  fetchFeaturedProducts,
} from "../services/product.service.js";
import { ApiResponse, redis, asyncHandler } from "../utils/utils.index.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await fetchAllProducts();
  return res
    .status(200)
    .json(new ApiResponse(200, "products fetched successfully", allProducts));
});

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
