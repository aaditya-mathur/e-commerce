import express from "express";
import {
  ensureAuthenticated,
  ensureAuthorized,
} from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", ensureAuthenticated, ensureAuthorized, getAnalytics);

export default router;