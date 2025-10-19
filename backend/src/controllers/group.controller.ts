import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { createGithubRepo, addCollaborator, githubUserExists } from "../repositories/github.repository.js";
import { findById } from "../repositories/auth.repository.js";
import { projectService } from "../services/projects.service.js";

export async function joinProject(req: Request, res: Response) {
    const { key } = req.params;
    const { students } = req.body as { students: { name: string; github: string }[] };

    if (!Array.isArray(students) || students.length === 0)
        return res.status(400).json({ error: "NO_STUDENTS" });

    // Validate that all names and GitHub usernames are filled
    for (const s of students) {
        if (!s.name?.trim()) return res.status(400).json({ error: "MISSING_NAME" });
        if (!s.github?.trim()) return res.status(400).json({ error: "MISSING_GITHUB" });
    }
    if (!key)
        return res.status(400).json({ error: "MISSING_PROJECT_KEY" });

    try {
        const project = await projectService.getByKey(key);

        if (!project)
            return res.status(404).json({ error: "PROJECT_NOT_FOUND" });

        const owner = await findById(project.profId);
        if (!owner)
            return res.status(400).json({ error: "PROJECT_OWNER_NOT_FOUND" });
        if (!owner.githubToken)
            return res.status(400).json({ error: "OWNER_NO_TOKEN" });

        console.log(`Project found: ${project.name}`);
        // ✅ Check GitHub users existence
        for (const s of students) {
            const exists = await githubUserExists(owner.githubToken, s.github);
            if (!exists)
                return res.status(400).json({ error: `INVALID_GITHUB_USER: ${s.github}` });
        }
        console.log("All GitHub users validated.");
        if (students.length < project.minPeople)
            return res.status(400).json({ error: "MINIMUM_NOT_MET" });
        if (students.length > project.maxPeople)
            return res.status(400).json({ error: "MAXIMUM_EXCEEDED" });
        console.log(`Creating group for project ${project.name} with ${students.length} students.`);

        // Save group in DB
        const group = await prisma.group.create({
            data: {
                projectId: project.id,
                students: { create: students },
            },
            include: { students: true },
        });

        // Create GitHub repo
        const org = project.organization;
        const groupCount = await prisma.group.count({
            where: { projectId: project.id },
        });
        const repoName = project.groupNamePattern.replace("##", groupCount.toString().padStart(2, "0"));
        const ghRepo = await createGithubRepo(owner.githubToken, org, repoName, {
            description: `Group ${group.id} for project ${project.name}`,
            private: true,
        });

        // Add collaborators
        for (const s of students) {
            console.log(`Adding collaborator: ${s.github}`);
            await addCollaborator(owner.githubToken, org, repoName, s.github);
        }

        await prisma.group.update({
            where: { id: group.id },
            // @ts-ignore
            data: { repoUrl: ghRepo.html_url },
        });

        // @ts-ignore
        res.json({ success: true, repo: ghRepo.html_url });
    } catch (err) {
        console.error("joinProject error:", err);
        res.status(500).json({ error: "SERVER_ERROR" });
    }
}
