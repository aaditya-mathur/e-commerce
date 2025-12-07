import { z } from "zod";

export const signUpPostRequestBodySchema = z.object({
  email: z.email().min(1, "email is required field"),
  name: z.string().min(1, "first name is required"),
  password: z
    .string()
    .min(8, "password must contain atleast 8 characters")
    .regex(/[A-Z]/, "password must contain atleast one uppercase character")
    .regex(/[a-z]/, "password must contain atleast one lowercase character")
    .regex(/[0-9]/, "password must contain atleast one number")
    .regex(
      /[^A-Za-z0-9]/,
      "password must contain at least one special character"
    ),
});

export const loginPostRequestBodySchema = z.object({
  email: z.email().min(1, " email is required "),
  password: z.string().min(1, " password is required "),
});

export const createProductPostRequestBodySchema = z.object({
  name: z.string().min(1, "product name is required"),
  description: z.string().min(1, "description is required"),
  price: z.coerce.number().min(0, "price must be a positive number"),

  image: z
    .string()
    .min(1, "image is required")
    .refine((val) => val.startsWith("data:image/"), {
      message: "image must be a valid base64 image string",
    }),

  category: z.string().min(1, "category is required"),
});

export const addToCartPostRequestBodySchema = z.object({
  productId: z.string().min(1, "product ID is required"),
});

export const updateQuantityPatchRequestBodySchema = z.object({
  quantity: z.coerce.number().min(1, "quantity must be at least 1"),
});

export const validateCouponPostRequestBodySchema = z.object({
  code: z.string().min(1, "coupon code is required"),
});