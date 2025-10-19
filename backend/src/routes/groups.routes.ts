import * as projectController from "../controllers/projects.controller.js";
import {Router} from "express";
const router = Router();

router.get("/:key", projectController.getProjectByKey);

export default router;