import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";
import { loginSchema, registerSchema } from "../schemas/userSchema";
import {
  comparePassword,
  createUser as createUserService,
  findUserByEmail,
  hashPassword,
} from "../services/authService";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const userRepo = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.format() });
    }
    const { email, password, username } = parsed.data;

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "Email exist!" });

    const passwordHash = await hashPassword(password);
    const user = await createUserService(email, passwordHash, username);

    const { password: _, ...userSafe } = user;
    return res.status(201).json({ user: userSafe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ errors: parsed.error.format() });
    const { email, password } = parsed.data;

    const user = await findUserByEmail(email);
    if (!user)
      return res.status(401).json({ message: "Невірні облікові дані" });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: "Невірні облікові дані" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (_: Request, res: Response) => {
  const users = await userRepo.find();
  res.json(users);
};
