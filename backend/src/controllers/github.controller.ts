import type {Request, Response} from "express";
import {handleGitHubCallback, getGitHubOrganizations} from "../services/github.service.js";
import {AuthError, GithubError} from "../utils/errors.js";
import {signJwt} from "../utils/jwt.js";
import {findById} from "../repositories/auth.repository.js";

export function githubLogin(_req: Request, res: Response) {
    console.log("Initiating GitHub login");
    const redirectUri = encodeURIComponent(process.env.GITHUB_REDIRECT_URI!);
    const githubClient = process.env.GITHUB_CLIENT_ID!;
    const redirect = `https://github.com/login/oauth/authorize?client_id=${githubClient}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
    return res.redirect(redirect);
}

function handleInstallationCallback(req: Request, res: Response) {
    const redirectUrl = (req.query.state as string) || "http://localhost:5173/dashboard";
    return res.redirect(redirectUrl);
}

async function handleLoginCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    const user = await handleGitHubCallback(code);
    const token = signJwt({ id: user.id, username: user.standardName });
    return res.redirect(`${process.env.FRONTEND_URL}/login?github_token=${token}`);
}

export async function githubCallback(req: Request, res: Response) {
    try {
        console.log("GitHub callback received with query:", req.query);
        if (req.query.installation_id)
            return handleInstallationCallback(req, res);
        else if (req.query.code)
            return handleLoginCallback(req, res);
        throw GithubError.ApiError("Invalid GitHub callback parameters");
    } catch (err: any) {
        if (err instanceof GithubError) {
            throw err;
        }
        console.error("GitHub callback error:", err);
        throw GithubError.ApiError("GitHub CallBack failed");
    }
}

type GitHubOrganization = {
    id: number;
    login: string;
    avatar_url: string;
    description: string | null;
    //Can add more fields if needed
};

export async function getUserOrganizations(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) throw AuthError.Unauthorized();

    const user = await findById(userId);
    if (!user || !user.githubToken)
        throw AuthError.Unauthorized();
    const orgs = await getGitHubOrganizations(user.githubToken) as GitHubOrganization[];
    const filtered: GitHubOrganization[] = orgs.map((org: any) => ({
        id: org.id,
        login: org.login,
        avatar_url: org.avatar_url,
        description: org.description,
    }));
    return res.json(filtered);
}