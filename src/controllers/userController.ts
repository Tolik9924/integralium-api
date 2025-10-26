import { Request, Response } from "express";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";
import { userSchema } from "../schemas/userSchema";

const userRepo = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.parse(req.body);
    const user = userRepo.create(parsed);
    await userRepo.save(user);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.errors ?? err.message });
  }
};

export const getUsers = async (_: Request, res: Response) => {
  const users = await userRepo.find();
  res.json(users);
};
