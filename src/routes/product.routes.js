import express from "express";
import { ensureAuthenticated, ensureAuthorized } from "../middleware/auth.middleware.js";
import { getAllProducts, getFeaturedProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/products", ensureAuthenticated, ensureAuthorized, getAllProducts);
router.get("/featuredProducts", getFeaturedProducts);

export default router;