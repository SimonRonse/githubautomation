import {authMiddleware} from "../middlewares/auth.middleware.js";
import {githubCallback, githubLogin, getUserOrganizations} from "../controllers/github.controller.js";
import {Router} from "express";
import {githubMiddleware} from "../middlewares/github.middleware.js";

const router = Router();
router.use(githubMiddleware)

router.get("/orgs",authMiddleware, getUserOrganizations);
router.get("/login", githubLogin);
router.get("/callback", githubCallback);
//router.get("/repos"); // TODO implement

export default router;