import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", ensureAuthenticated, getProfile);
router.post("/refreshToken", refreshToken);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/login", login);

export default router;