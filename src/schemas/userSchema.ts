import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(2, { message: "Ім'я занадто коротке" }),
  email: z.email(),
});

export type UserInput = z.infer<typeof userSchema>;
