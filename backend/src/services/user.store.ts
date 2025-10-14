import { prisma } from "../db/prisma.js";
import { v4 as uuid } from "uuid";

// Prisma model type
import type { User } from "@prisma/client";

/**
 * Find a user by username (standardName)
 */
export async function findByUsername(username: string): Promise<User | null> {
    return prisma.user.findFirst({
        where: { standardName: username },
    });
}

/**
 * Find a user by email
 */
export async function findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { email },
    });
}

/**
 * Find a user by ID
 */
export async function findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: { id },
    });
}

export async function findByGitHubName(githubName: string): Promise<User | null> {
    return prisma.user.findFirst({
        where: { githubName },
    });
}

/**
 * Save a new user
 */
export async function saveUser(data: {
    username: string;
    githubName?: string | null;
    email: string;
    passwordHash: string;
    githubToken?: string | null;
}): Promise<User> {
    const user = await prisma.user.create({
        data: {
            id: uuid(),
            email: data.email,
            passwordHash: data.passwordHash,
            standardName: data.username,
            githubName: data.githubName ?? null,
            githubToken: data.githubToken ?? null,
        },
    });
    console.log("✅ User created:", user.email);
    return user;
}

/**
 * Update a user's GitHub token
 */
export async function setGitHubCredential(id: string, token: string, githubName?:string): Promise<void> {
    console.log("🔹 Setting GitHub token for user:", id);
    await prisma.user.update({
        where: { id },
        data: { githubToken: token },
    });
    console.log("🔹 Updated GitHub token for user:", id);
}
