import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as projectController from "../controllers/projects.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/", projectController.listProjects);
router.get("/:id", projectController.getProject);
router.post("/", projectController.createProject);
router.patch("/:id", projectController.updateProject);

export default router;
