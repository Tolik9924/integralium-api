import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "gtv19990924",
  database: "integralium_db",
  synchronize: true, // ! WARNING: set to false in production
  logging: false,
  entities: [User],
});
