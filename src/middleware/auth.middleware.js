import jwt from "jsonwebtoken";
import { findExistingUserById } from "../services/user.service.js";
import { ApiError, asyncHandler } from "../utils/utils.index.js";

export const ensureAuthenticated = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new ApiError(401, "no access token provided");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const existingUser = await findExistingUserById(decoded._id);

    if (!existingUser) {
      throw new ApiError(401, "invalid access token - user not found");
    }

    req.user = existingUser;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "access token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "invalid access token");
    }

    throw error;
  }
});

export const ensureAuthorized = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  throw new ApiError(403, "admin access required");
});