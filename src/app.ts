import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/users", userRoutes);

export default app;
