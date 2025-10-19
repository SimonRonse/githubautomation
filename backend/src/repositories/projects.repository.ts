import {prisma} from "../db/prisma.js";
import {NotFoundError} from "../utils/errors.js";

export const projectRepository = {
    async findById(id: string) {
        const project = await prisma.project.findUnique({ where: { id } });
        if (!project) throw new NotFoundError("Project not found");
        return project;
    },

    async findByProf(profId: string) {
        return prisma.project.findMany({
            where: { profId },
            select: {
                id: true,
                name: true,
                organization: true,
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async create(data: {
        organization: string;
        name: string;
        minPeople: number;
        maxPeople: number;
        totalPeople: number;
        groupNamePattern: string;
        profId: string;
        key: string;
    }) {
        return prisma.project.create({ data });
    },

    async update(id: string, updates: Partial<{
        organization: string;
        name: string;
        minPeople: number;
        maxPeople: number;
        totalPeople: number;
        groupNamePattern: string;
    }>) {
        return prisma.project.update({
            where: { id },
            data: updates,
        });
    },

    async delete(id: string) {
        return prisma.project.delete({ where: { id } });
    },
};
