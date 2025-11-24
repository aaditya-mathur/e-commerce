import {
  loginPostRequestBodySchema,
  signUpPostRequestBodySchema,
} from "../validations/request.validation.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  const validationResult = await signUpPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.format() });
  }

  const { name, email, password, address } = validationResult.data;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    return res.status(200).json({ message: "User already exists" });
  }

  const newUser = await User.create({
    name,
    email,
    password,
    address,
  });

  return res.status(201).json({
    message: "User created successfully",
    createdUser: { _id: newUser._id, email: newUser.email, name },
  });
};

export const login = async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;

  const existingUser = await User.findOne({
    email,
  });

  if (!existingUser) {
    return res.status(200).json({ message: "User does not exist" });
  }

  const isPasswordValid = existingUser.isPasswordCorrect(password);

  if( !isPasswordValid )
  {
    return res.status(400).json({message : "either email or password is incorrect"})
  }

  const accessToken = await existingUser.generateAccessToken();
  const refreshToken = await existingUser.generateRefreshToken();

  return res.json({ accessToken, refreshToken });
};
