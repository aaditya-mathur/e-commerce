import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findExistingUserById } from "../services/user.service.js";
import { ApiError, asyncHandler } from "../utils/utils.index.js";

dotenv.config();

export const ensureAuthenticated = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new ApiError(
      401,
      "unauthenticated access - no access token provided"
    );
  }

  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const existingUser = await findExistingUserById(decoded?._id);

  if (!existingUser) {
    throw new ApiError(401, "unauthenticated access - invalid access token");
  }

  req.user = existingUser;
  next();
});

export const ensureAuthorized = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    return next();
  }
  throw new ApiError(403, "unauthorized access - admin only");
});
