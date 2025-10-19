import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { githubLogin, githubCallback } from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authMiddleware, register);
router.post("/login", login);
router.get("/me",authMiddleware, me);
router.get("/github/login", githubLogin);
router.get("/github/callback", githubCallback);

export default router;
