import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.DATA_BASE_PASSWORD,
  database: process.env.DATA_BASE_NAME,
  synchronize: true, // ! WARNING: set to false in production
  logging: false,
  entities: [User],
});
