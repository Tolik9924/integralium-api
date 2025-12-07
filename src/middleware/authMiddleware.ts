import { Request, Response } from "express";
import { NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.ACCESS_SECRET || "dev-access";

export type AuthRequest = Request & {
  user?: JwtPayload | { id: number };
};

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401); // Unauthorized
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as { id: number };
    req.user = decoded;
    next();
  } catch (err) {
    return res.sendStatus(403); // Forbidden
  }
};
