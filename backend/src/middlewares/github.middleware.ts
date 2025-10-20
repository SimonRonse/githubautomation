import {ServerError} from "../utils/errors.js";
import type {NextFunction, Request, Response} from "express";

export function githubMiddleware(_req: Request, _res: Response, next: NextFunction) {
    const required = [
        "GITHUB_CLIENT_ID",
        "GITHUB_CLIENT_SECRET",
        "GITHUB_REDIRECT_URI",
        "GITHUB_ALLOWED_USER",
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length){
        console.error(`Missing GitHub OAuth environment variables: ${missing.join(", ")}`);
        throw ServerError.Internal();
    }
    next();
}