import { ApiError, ApiResponse, asyncHandler } from "../utils/utils.index.js";
import { Product } from "../models/product.model.js";
import {
  addToCartPostRequestBodySchema,
  updateQuantityPatchRequestBodySchema,
} from "../validations/request.validation.js";

// TO GET STORED PRODUCTS IN CART
export const getProducts = asyncHandler(async (req, res) => {
  const productIds = req.user.cartItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  const cartItems = products.map((product) => {
    const item = req.user.cartItems.find(
      (cartItem) => cartItem.product.toString() === product._id.toString()
    );
    return { ...product.toJSON(), quantity: item.quantity };
  });

  return res.status(200).json(new ApiResponse(200, "success", cartItems));
});

// TO ADD PRODUCTS IN CART
export const addToCart = asyncHandler(async (req, res) => {
  const validationResult = await addToCartPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    throw new ApiError(
      400,
      "validation failed",
      validationResult.error.format()
    );
  }

  const { productId } = validationResult.data;

  const existingItem = req.user.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    req.user.cartItems.push({ product: productId, quantity: 1 });
  }

  await req.user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "item added successfully", req.user.cartItems));
});

// TO COMPLETELY REMOVE EXISTING PRODUCT
export const removeAll = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const existingItem = req.user.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (!existingItem) {
    throw new ApiError(404, "could not find product");
  }

  req.user.cartItems = req.user.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  await req.user.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, "item deleted successfully", req.user.cartItems)
    );
});

// TO UPDATE QUANTITY
export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const validationResult =
    await updateQuantityPatchRequestBodySchema.safeParseAsync(req.body);

  if (validationResult.error) {
    throw new ApiError(
      400,
      "validation failed",
      validationResult.error.format()
    );
  }

  const { quantity } = validationResult.data;

  const existingItem = req.user.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (!existingItem) {
    throw new ApiError(404, "could not find product");
  }

  if (quantity === 0) {
    req.user.cartItems = req.user.cartItems.filter(
      (item) => item.product.toString() !== productId
    );
  } else {
    existingItem.quantity = quantity;
  }

  await req.user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "item quantity updated", req.user.cartItems));
});