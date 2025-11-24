import { User } from "../models/user.model.js";

export const findExistingUser = async (email) => {
  const existingUser = await User.findOne({
    email,
  });
  return existingUser;
};

export const createNewUser = async (name, email, password, address) => {
  const newUser = await User.create({
    name,
    email,
    password,
    address,
  });
  return newUser;
};
