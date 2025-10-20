import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { createGithubRepo, addCollaborator, githubUserExists } from "../repositories/github.repository.js";
import { findById } from "../repositories/auth.repository.js";
import { projectService } from "../services/projects.service.js";
import {GithubError, GroupError, ProjectError} from "../utils/errors.js";
import {groupRepository} from "../repositories/groups.repository.js";

async function getProjectAndToken(key: string | undefined) {
    if (!key)
        throw ProjectError.Invalid("Wrong Project Key (check URL)");

    const project = await projectService.getByKey(key);
    if (!project)
        throw ProjectError.Invalid("Wrong Project Key (check URL)");

    const owner = await findById(project.profId);
    if (!owner)
        throw ProjectError.Invalid("Project owner not found, ask your teacher");
    const token = owner.githubToken;
    if (!owner.githubToken)
        throw ProjectError.Invalid("Project owner has no GitHub token, ask your teacher ");
    return {project, token};
}

async function checkStudents(project: {minPeople: number, maxPeople: number }, students: { name: string; github: string }[], token: string) {
    if (!Array.isArray(students) || students.length < project.minPeople)
        throw GroupError.Min(project.minPeople, students.length);
    if (students.length > project.maxPeople)
        throw GroupError.Max(project.maxPeople, students.length);

    //TODO: provide the number of the invalid student for the frontend to show under that tile
    //TODO: Zod schema validation
    for (const s of students) {
        if (!s.name?.trim()) throw GroupError.Student(s.name);
        if (!s.github?.trim()) throw GroupError.Github(s.github);

        const exists = await githubUserExists(token!, s.github);
        if (!exists)
            throw GithubError.UserNotFound(s.github);
    }
}

export async function joinProject(req: Request, res: Response) {
    const { key } = req.params;
    const {project, token} = await getProjectAndToken(key);

    const { students } = req.body as { students: { name: string; github: string }[] };
    await checkStudents(project, students, token!);

    const group = await groupRepository.create(project.id, students);

    const repo = await createRepository(token!, project, students, group).catch((err => {
        console.log("Error creating GitHub repo:", err);
        //Fallback: delete the created group
        prisma.group.delete({ where: { id: group.id } });
        throw err;
    }));

    res.json({ success: true, repo: repo.html_url });
}

async function createRepository(token: string, project: {organization:string, id: string, name: string, groupNamePattern: string}, students: {github: string}[], group: {id: number}) {
    const org = project.organization;

    const groupCount = await groupRepository.countByProject(project.id);
    const repoName = project.groupNamePattern.replace("##", groupCount.toString().padStart(2, "0"));

    const ghRepo = await createGithubRepo(token!, org, repoName, {
        description: `Group ${group.id} for project ${project.name}`,
        private: true,
    });
    type GhRepo = {html_url: string};
    const repo = ghRepo.data as GhRepo;

    for (const s of students) {
        await addCollaborator(token!, org, repoName, s.github);
    }

    await groupRepository.update(group.id, { repoUrl: repo.html_url });
    return repo;
}