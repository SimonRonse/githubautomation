import crypto from "node:crypto";
import {projectRepository} from "../repositories/projects.repository.js";
import {BadRequestError, ForbiddenError} from "../utils/errors.js";
import {getOrganizationDetails} from "../repositories/github.repository.js";
import {findById} from "../repositories/auth.repository.js";



export const projectService = {
    async getById(id: string, profId: string) {
        const project = await projectRepository.findById(id);
        if (project.profId !== profId) throw new ForbiddenError();
        return project;
    },

    async listForDashboard(userId: string) {
        const user = await findById(userId);

        if (!user || !user.githubToken)
            throw new BadRequestError("NO_GITHUB_TOKEN");

        const projects = await projectRepository.findByProf(userId);

        // Prepare GitHub data for each org
        return await Promise.all(
            projects.map(async (p) => {
                const orgInfo = await getOrganizationDetails(p.organization, user.githubToken!);
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
        console.log(input);
        if (!input.name || !input.organization)
            throw new BadRequestError("Missing project name or organization");

        if (input.minPeople && input.maxPeople && input.minPeople > input.maxPeople)
            throw new BadRequestError("Min people cannot exceed max people");

        return projectRepository.create({
            organization: input.organization,
            name: input.name,
            minPeople: input.minPeople ?? 1,
            maxPeople: input.maxPeople ?? 3,
            totalPeople: input.totalPeople ?? 20,
            groupNamePattern: input.groupNamePattern ?? "",
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
        if (project.profId !== profId) throw new ForbiddenError();

        if (updates.minPeople && updates.maxPeople && updates.minPeople > updates.maxPeople)
            throw new BadRequestError("Min people cannot exceed max people");

        return projectRepository.update(id, updates);
    },
};
