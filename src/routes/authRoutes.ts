import { Router } from "express";
import {
  createUser,
  getUsers,
  login,
  logout,
  refreshToken,
} from "../controllers/authController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", getUsers);
router.get("/refresh", auth, refreshToken);

export default router;
