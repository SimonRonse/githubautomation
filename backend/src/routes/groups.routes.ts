import * as projectController from "../controllers/projects.controller.js";
import {Router} from "express";
import {joinProject} from "../controllers/group.controller.js";
const router = Router();

router.get("/:key", projectController.getProjectByKey);
router.post("/:key", joinProject);

export default router;