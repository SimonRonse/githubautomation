import { Router } from "express";
import { getUserOrganizations } from "../controllers/github.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/orgs", authMiddleware, getUserOrganizations);

export default router;
