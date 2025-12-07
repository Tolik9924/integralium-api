import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";
import { loginSchema, registerSchema } from "../validation/userSchema";
import { User as UserType } from "../types/auth";
import {
  comparePassword,
  createUser as createUserService,
  findUserByEmail,
  hashPassword,
} from "../services/authService";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/tokenService";

const REFRESH_SECRET: string = process.env.REFRESH_SECRET || "dev-refresh";

const userRepo = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
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
      return res.status(400).json({ errors: parsed.error.issues });
    const { email, password } = parsed.data;

    const user = await findUserByEmail(email);
    if (!user)
      return res.status(401).json({ message: "Incorrect credentials." });

    const ok = await comparePassword(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Password is not correct" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in prod with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const user = jwt.verify(token, REFRESH_SECRET as string) as UserType;

    const accessToken = generateAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    return res.sendStatus(403);
  }
};

export const logout = async (_: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const getUsers = async (_: Request, res: Response) => {
  const users = await userRepo.find();
  res.json(users);
};
