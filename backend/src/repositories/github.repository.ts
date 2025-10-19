import type {Request, Response} from "express";
import { findById } from "./auth.repository.js";
import axios from "axios";

type GitHubOrganization = {
    id: number;
    login: string;
    avatar_url: string;
    description: string | null;
    //Can add more fields if needed
};
//TODO rewrite with controller and service + Axios
export async function getUserOrganizations(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id; // from auth middleware
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

export async function getOrganizationDetails(orgName: string, token: string) {
    try {
        const res = await axios.get(`https://api.github.com/orgs/${orgName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "painautomationgithub-App",
            },
        });
        return {
            login: res.data.login,
            avatar_url: res.data.avatar_url,
            description: res.data.description,
        };
    } catch (err: any) {
        console.error(`Failed to fetch org details for ${orgName}:`, err.response?.status, err.response?.data);
        return null;
    }
}