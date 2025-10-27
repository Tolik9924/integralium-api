import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email({ message: "Invalid email" }),
    username: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must contain minimum 8 symbols." }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must contain 8 symbols.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(1),
});
