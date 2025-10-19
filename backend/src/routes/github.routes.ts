import {getUserOrganizations} from "../repositories/github.repository.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import {Router} from "express";

const router = Router();

router.get("/orgs", authMiddleware, getUserOrganizations);

export default router;