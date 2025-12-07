import { User } from "../models/user.model.js";

export const findExistingUser = async (email) => {
  const existingUser = await User.findOne({ email });
  return existingUser;
};

export const findExistingUserById = async (userId) => {
  const existingUser = await User.findById(userId).select("-password");
  return existingUser;
};

export const createNewUser = async (name, email, password) => {
  const newUser = await User.create({
    name,
    email,
    password,
  });
  return newUser;
};