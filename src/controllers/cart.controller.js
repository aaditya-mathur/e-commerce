import { ApiError, ApiResponse, asyncHandler } from "../utils/utils.index.js";
import { Product } from "../models/product.model.js";

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
  const user = req.user;
  const { productId } = req.body;

  const existingItem = user.cartItems.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    user.cartItems.push({ product: productId, quantity: 1 });
  }
  await user.save();
  return res.status(200).json(new ApiResponse(200, "item added successfully"));
});

// TO COMPLETELY REMOVE EXISTING PRODUCT
export const removeAll = asyncHandler(async (req, res) => {
  const user = req.user;
  const { productId } = req.params;

  const existingItem = user.cartItems.find(
    (item) => item.product.toString() === productId
  );
  if (!existingItem) {
    throw new ApiError(404, "could not find product");
  }
  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "item deleted successfully"));
});

// TO ADJUST QUANTITY
export const updateQuantity = asyncHandler(async (req, res) => {
  const user = req.user;
  const { productId } = req.params;
  const { quantity } = req.body;
  const existingItem = user.cartItems.find(
    (item) => item.product.toString() === productId
  );
  if (!existingItem) {
    throw new ApiError(404, "could not find product");
  }
  existingItem.quantity = quantity;
  await user.save();
  return res.status(200).json(new ApiResponse(200, "item quantity updated"));
});
