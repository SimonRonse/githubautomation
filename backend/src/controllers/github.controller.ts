import type {Request, Response} from "express";
import { findById } from "../services/user.store.js";

type GitHubOrganization = {
    id: number;
    login: string;
    avatar_url: string;
    description: string | null;
    //Can add more fields if needed
};

export async function getUserOrganizations(req: Request, res: Response) {
    try {
        console.log("getUserOrganizations invoked");
        const userId = (req as any).user?.id; // from auth middleware
        console.log("getUserOrganizations called by userId:", userId);
        if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });

        const user = await findById(userId);
        if (!user || !user.githubToken)
            return res.status(400).json({ error: "NO_GITHUB_TOKEN" });

        const ghResponse = await fetch("https://api.github.com/user/orgs", {
            headers: {
                Authorization: `Bearer ${user.githubToken}`,
                Accept: "application/vnd.github.v3+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "painautomationgithub-App",
            },
        });

        if (!ghResponse.ok) {
            const errText = await ghResponse.text();
            console.error("GitHub API error:", errText);
            return res.status(ghResponse.status).json({ error: "GITHUB_API_ERROR" });
        }

        const orgs = await ghResponse.json() as GitHubOrganization[];
        console.log("Fetched organizations:", orgs);
        // Minimal projection to reduce payload
        const filtered: GitHubOrganization[] = orgs.map((org: any) => ({
            id: org.id,
            login: org.login,
            avatar_url: org.avatar_url,
            description: org.description,
        }));

        res.json(filtered);
    } catch (err) {
        console.error("getUserOrganizations error:", err);
        res.status(500).json({ error: "INTERNAL_ERROR" });
    }
}
