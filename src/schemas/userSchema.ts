import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be more than two symbols." }),
  email: z.email(),
  password: z.string(),
});

export type UserInput = z.infer<typeof userSchema>;
