import { Router } from "express";
import { createUser, getUsers, login } from "../controllers/authController";

const router = Router();

router.post("/", createUser);
router.post("/login", login);
router.get("/", getUsers);

export default router;
