import { z } from 'zod'

export const signUpPostRequestBodySchema = z.object({
  email: z.email().min(1, "email is required field"),
  name: z.string().min(1, "first name is required"),
  address: z.string().min(1, "address is required"),
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
  password: z.string().min(1, " password is required ")
});