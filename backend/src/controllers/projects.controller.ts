import type { Request, Response } from "express";
import {projectService} from "../services/projects.service.js";
import {ProjectError} from "../utils/errors.js";


export async function getProject(req: Request, res: Response) {
    if (!req.params.id)
        throw ProjectError.Invalid("No project ID provided");
    const project = await projectService.getById(req.params.id, req.user.id);
    return res.json(project);
}

export async function getProjectByKey(req: Request, res: Response) {
    if (!req.params.key)
        throw ProjectError.Invalid("No project key provided");
    const project = await projectService.getByKey(req.params.key);
    return res.json(project);
}

export async function listProjects(req: Request, res: Response) {
    const userId = req.user.id;
    const projects = await projectService.listForDashboard(userId);
    return res.json(projects);
}

export async function createProject(req: Request, res: Response) {
    const project = await projectService.createProject({
        ...req.body,
        profId: req.user.id,
    });
    return res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response) {
    if (!req.params.id)
        throw ProjectError.Invalid("No project ID provided");

    const project = await projectService.updateProject(
        req.params.id,
        req.user.id,
        req.body
    );
    res.json(project);
}
