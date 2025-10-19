import { prisma } from "../db/prisma.js";

export async function createGroup(data) {
    return prisma.group.create({
        data,
        include: { students: true },
    });
}

export async function updateGroupRepoUrl(groupId, repoUrl) {
    return prisma.group.update({
        where: { id: groupId },
        data: { repoUrl },
    });
}

export async function countGroupsByProject(projectId) {
    return prisma.group.count({
        where: { projectId },
    });
}
