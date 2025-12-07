import jwt from "jsonwebtoken";
import { User } from "../types/auth";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "dev-access";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "dev-refresh";

export const generateAccessToken = (user: User) => {
  return jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });
};
