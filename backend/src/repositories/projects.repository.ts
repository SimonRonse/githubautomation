import {prisma} from "../db/prisma.js";

export const projectRepository = {
    async findById(id: string) {
        return prisma.project.findUnique({ where: { id } });
    },

    async findByKey(key: string) {
        return prisma.project.findUnique({ where: { key } });
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
