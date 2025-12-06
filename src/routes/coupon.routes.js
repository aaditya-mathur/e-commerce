import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", ensureAuthenticated, getCoupon);
router.post("/validate", ensureAuthenticated, validateCoupon);

export default router;