import type {Request, Response} from "express";
import * as Auth from "../services/auth.service.js";

export async function githubCallback(req: Request, res: Response) {
    try {
        console.log("GitHub callback received with query:", req.query);
        if (req.query.installation_id) {

            const redirectUrl = (req.query.state as string) || "http://localhost:5173/dashboard";
                return res.redirect(redirectUrl);
        }
        else if (req.query.code) {
            const code = req.query.code as string;
            const token = await Auth.handleGitHubCallback(code);
            return res.redirect(`${process.env.FRONTEND_URL}/login?github_token=${token}`);
        }
        return res.status(400).json({ error: "Missing code" });
    } catch (err: any) {
        console.error("GitHub auth error:", err);
        return res.status(500).json({ error: err.message || "GitHub authentication failed" });
    }
}