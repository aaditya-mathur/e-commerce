import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refreshToken", refreshToken);
router.get("/logout", logout);

export default router;