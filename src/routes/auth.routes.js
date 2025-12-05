import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import {
  ensureAuthenticated,
  ensureAuthorized,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/refreshToken", refreshToken);
router.get("/logout", logout);
router.get("/profile", ensureAuthenticated, getProfile);
router.post("/signup", signup);
router.post("/login", login);

export default router;