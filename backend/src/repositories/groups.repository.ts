import { prisma } from "../db/prisma.js";
import type { Group } from "@prisma/client";

export const groupRepository = {
    async create(projectId: string, students: { name: string; github: string }[]) {
        return prisma.group.create({
            data: {
                projectId,
                students: { create: students },
            },
            include: { students: true },
        });
    },

    async delete(groupId: number) {
        return prisma.group.delete({
            where: { id: groupId },
        });
    },

    async update(groupId: number, updates: Partial<{ repoUrl: string }>) {
        return prisma.group.update({
            where: { id: groupId },
            data: updates,
            include: { students: true },
        });
    },

    async countByProject(projectId: string) {
        return prisma.group.count({
            where: { projectId },
        });
    }
};