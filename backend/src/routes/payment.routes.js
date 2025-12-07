import express from "express";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  ensureAuthenticated,
  createCheckoutSession
);
router.post("/checkout-success", ensureAuthenticated, checkoutSuccess);

export default router;