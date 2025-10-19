import type { Request, Response } from "express";
import {projectService} from "../services/projects.service.js";
import {BadRequestError, ForbiddenError, NotFoundError} from "../utils/errors.js";

export async function getProject(req: Request, res: Response) {
    if (!req.params.id)
        throw new BadRequestError("Project ID is required");
    try {
        const project = await projectService.getById(req.params.id, req.user.id);
        res.json(project);
    } catch (err) {
        handleError(res, err);
    }
}

export async function getProjectByKey(req: Request, res: Response) {
    if (!req.params.key)
        throw new BadRequestError("Project key is required");
    try {
        console.log("Fetching project with key:", req.params.key);
        const project = await projectService.getByKey(req.params.key);
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
    if (!req.params.id)
        throw new BadRequestError("Project ID is required");

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
