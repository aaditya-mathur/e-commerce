import { User } from "../models/user.model.js";
import { ApiError } from "../utils/utils.index.js";

// FOR FINDING EXISTING USER BY EMAIL
export const findExistingUser = async (email) => {
  try {
    const existingUser = await User.findOne({
      email,
    });
    return existingUser;
  } catch (error) {
    console.error(`error occurred while find existing user`, error.message);
    throw new ApiError(500, "Database error while finding user");
  }
};

// FOR FINDING EXISTING USER BY ID
export const findExistingUserById = async (userId) => {
  try {
    const existingUser = await User.findById(userId).select("-password");
    return existingUser;
  } catch (error) {
    console.error("Error finding user by ID:", error.message);
    throw new ApiError(500, "Database error while finding user");
  }
};

// FOR CREATING NEW USER
export const createNewUser = async (name, email, password, address) => {
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      address,
    });
    return newUser;
  } catch (error) {
    console.error(`error occurred while creating new user`, error.message);
    throw new ApiError(500, "Database error while creating user");
  }
};