import {
  loginPostRequestBodySchema,
  signUpPostRequestBodySchema,
} from "../validations/request.validation.js";
import { createNewUser, findExistingUser } from "../services/user.service.js";
import { asyncHandler } from "../utils/utils.index.js";
import { ApiResponse, ApiError, client } from "../utils/utils.index.js";

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

const storeRefreshToken = async (userId, refreshToken) => {
  await client.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

export const login = asyncHandler(async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    throw new ApiError(
      400,
      "user already exists",
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
    return res
      .status(400)
      .json({ message: "either email or password is incorrect" });
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  const accessToken = await existingUser.generateAccessToken();
  const refreshToken = await existingUser.generateRefreshToken();

  await storeRefreshToken(existingUser._id, refreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "user login successfull"));
});