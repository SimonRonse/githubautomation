import crypto from "node:crypto";
import {projectRepository} from "../repositories/projects.repository.js";
import {getGitHubOrgDetails} from "./github.service.js";
import {findById} from "../repositories/auth.repository.js";
import {AuthError, ProjectError} from "../utils/errors.js";



export const projectService = {
    async getById(id: string, profId: string) {
        const project = await projectRepository.findById(id);
        if (!project) throw ProjectError.Missing(id);
        if (project.profId !== profId) throw ProjectError.UnauthorizedAccess(id);
        return project;
    },

    async getByKey(key: string) {
        return projectRepository.findByKey(key);
    },

    async listForDashboard(userId: string) {
        const user = await findById(userId);

        if (!user || !user.githubToken)
            throw AuthError.UserNotFound(userId);

        const projects = await projectRepository.findByProf(userId);

        // Prepare GitHub data for each org
        return await Promise.all(
            projects.map(async (p) => {
                const orgInfo = await getGitHubOrgDetails(p.organization, user.githubToken!);
                return {
                    id: p.id,
                    name: p.name,
                    avatar_url: orgInfo?.avatar_url ?? "",
                    description: orgInfo?.description ?? "",
                };
            })
        );

    },

    async createProject(input: {
        organization?: string;
        name?: string;
        minPeople?: number;
        maxPeople?: number;
        totalPeople?: number;
        groupNamePattern?: string;
        profId: string;
    }) {
        checkProject(input);
        return projectRepository.create({
            organization: input.organization!,
            name: input.name!,
            minPeople: input.minPeople!,
            maxPeople: input.maxPeople!,
            totalPeople: input.totalPeople!,
            groupNamePattern: input.groupNamePattern!,
            profId: input.profId,
            key: crypto.randomUUID(),
        });
    },

    async updateProject(id: string, profId: string, updates: Partial<{
        organization: string;
        name: string;
        minPeople: number;
        maxPeople: number;
        groupNamePattern: string;
    }>) {
        const project = await projectRepository.findById(id);
        if (!project) throw ProjectError.Missing(id);
        if (project.profId !== profId) throw ProjectError.UnauthorizedAccess(id);

        checkProject({ ...project, ...updates, profId });

        return projectRepository.update(id, updates);
    },
};
function checkProject(project: {
    organization?: string;
    name?: string;
    minPeople?: number;
    maxPeople?: number;
    totalPeople?: number;
    groupNamePattern?: string;
    profId: string;
}){
    //Check organization name min max pattern and throw ProjectError.Invalid(missing field)

    if (!project.organization){
        throw ProjectError.Invalid("organization");
    }
    if (!project.name){
        throw ProjectError.Invalid("name");
    }
    if (!project.minPeople || project.minPeople < 1){
        throw ProjectError.Invalid("minPeople");
    }
    if (!project.maxPeople || project.maxPeople < project.minPeople){
        throw ProjectError.Invalid("maxPeople");
    }
    if (project.totalPeople === undefined || project.totalPeople < project.maxPeople){
        throw ProjectError.Invalid("totalPeople");
    }
    if (!project.groupNamePattern){
        throw ProjectError.Invalid("groupNamePattern");
    }
}