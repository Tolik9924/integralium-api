import bcrypt from "bcryptjs";
import { AppDataSource } from "../db/data-source";
import { User } from "../entities/User";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export const hashPassword = async (plain: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

export const findUserByEmail = async (email: string) => {
  return AppDataSource.getRepository(User).findOneBy({ email });
};

export const createUser = async (
  email: string,
  passwordHash: string,
  username: string
) => {
  const repo = AppDataSource.getRepository(User);
  const user = repo.create({ email, password: passwordHash, username });
  return repo.save(user);
};
