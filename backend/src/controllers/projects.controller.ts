import type { Request, Response } from "express";
import {projectService} from "../services/projects.service.js";
import {BadRequestError, ForbiddenError, NotFoundError} from "../utils/errors.js";

export async function getProject(req: Request, res: Response) {
    try {
        console.log("getProject invoked with id:", req.params.id, " user: ", req.user.id);
        const project = await projectService.getById(req.params.id, req.user.id);
        project.key = process.env.FRONTEND_ORIGIN + '/createGroup/' + project.key;
        res.json(project);
    } catch (err) {
        handleError(res, err);
    }
}

export async function listProjects(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const projects = await projectService.listForDashboard(userId);
        res.json(projects);
    } catch (err) {
        handleError(res, err);
    }
}

export async function createProject(req: Request, res: Response) {
    try {
        console.log("getProject invoked with id:", req.params.id, "by user:", req.user.id);
        const project = await projectService.createProject({
            ...req.body,
            profId: req.user.id,
        });
        res.status(201).json(project);
    } catch (err) {
        handleError(res, err);
    }
}

export async function updateProject(req: Request, res: Response) {
    try {
        const project = await projectService.updateProject(
            req.params.id,
            req.user.id,
            req.body
        );
        res.json(project);
    } catch (err) {
        handleError(res, err);
    }
}

// Shared error mapper
function handleError(res: Response, err: unknown) {
    if (err instanceof BadRequestError)
        return res.status(400).json({ error: err.message });
    if (err instanceof ForbiddenError)
        return res.status(403).json({ error: err.message });
    if (err instanceof NotFoundError)
        return res.status(404).json({ error: err.message });

    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "SERVER_ERROR" });
}
