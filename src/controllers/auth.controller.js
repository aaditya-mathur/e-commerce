import {
  loginPostRequestBodySchema,
  signUpPostRequestBodySchema,
} from "../validations/request.validation.js";
import {
  createNewUser,
  findExistingUser,
  findExistingUserById,
} from "../services/user.service.js";
import {
  ApiResponse,
  ApiError,
  redis,
  asyncHandler,
} from "../utils/utils.index.js";
import jwt from "jsonwebtoken";

//FOR USER SIGNUP
export const signup = asyncHandler(async (req, res) => {
  const validationResult = await signUpPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    throw new ApiError(
      400,
      "validation failed",
      validationResult.error.format()
    );
  }

  const { name, email, password, address } = validationResult.data;

  const existingUser = await findExistingUser(email);

  if (existingUser) {
    throw new ApiError(400, "user already exists");
  }

  const newUser = await createNewUser(name, email, password, address);

  return res.status(200).json(
    new ApiResponse(200, "user created successfully", {
      createdUser: { _id: newUser._id, email: newUser.email, name },
    })
  );
});

// FUNCTION FOR STORING REFRESH TOKEN IN REDIS
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

// FOR USER LOGIN
export const login = asyncHandler(async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    throw new ApiError(
      400,
      "validation failed",
      validationResult.error.format()
    );
  }

  const { email, password } = validationResult.data;

  const existingUser = await findExistingUser(email);

  if (!existingUser) {
    throw new ApiError(400, "user does not exist");
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "either email or password is incorrect");
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  const accessToken = existingUser.generateAccessToken();
  const refreshToken = existingUser.generateRefreshToken();

  await storeRefreshToken(existingUser._id, refreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "user login successful"));
});

//  FOR REFRESH TOKEN
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "no refresh token provided");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const storedRefreshToken = await redis.get(`refresh_token:${decoded._id}`);

  if (storedRefreshToken !== refreshToken) {
    throw new ApiError(401, "invalid refresh token");
  }

  const existingUser = await findExistingUserById(decoded._id);

  if (!existingUser) {
    throw new ApiError(404, "user not found");
  }

  const accessToken = existingUser.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "access token refreshed successfully"));
});

// FOR USER LOGOUT
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "user is not logged in");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  await redis.del(`refresh_token:${decoded._id}`);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export const getProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "user profile fetched successfully", req.user));
});