import express from "express";
import {
  addToCart,
  getProducts,
  removeAll,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", ensureAuthenticated, getProducts);
router.post("/", ensureAuthenticated, addToCart);
router.patch("/:productId", ensureAuthenticated, updateQuantity);
router.delete("/:productId", ensureAuthenticated, removeAll);

export default router;