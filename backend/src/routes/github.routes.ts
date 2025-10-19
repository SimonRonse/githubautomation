import {getUserOrganizations} from "../repositories/github.repository.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import {githubCallback} from "../controllers/github.controller.js";
import {Router} from "express";

const router = Router();

router.get("/orgs",authMiddleware, getUserOrganizations);
router.get("/callback", githubCallback);
//router.get("/repos"); // TODO implement

export default router;