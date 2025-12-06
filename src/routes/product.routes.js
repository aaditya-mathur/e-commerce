import express from "express";
import {
  ensureAuthenticated,
  ensureAuthorized,
} from "../middleware/auth.middleware.js";
import {
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  createProduct,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", ensureAuthenticated, ensureAuthorized, getAllProducts);
router.get("/featuredProducts", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/create", ensureAuthenticated, ensureAuthorized, createProduct);
router.patch(
  "/:id",
  ensureAuthenticated,
  ensureAuthorized,
  toggleFeaturedProduct
);
router.delete("/:id", ensureAuthenticated, ensureAuthorized, deleteProduct);

export default router;