import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { githubLogin, githubCallback } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", me);
router.get("/github/login", githubLogin);
router.get("/github/callback", githubCallback);

export default router;
