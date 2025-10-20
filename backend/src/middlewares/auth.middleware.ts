import type {Request, Response, NextFunction} from "express";
import { verifyJwt } from "../utils/jwt.js";
import { findById } from "../repositories/auth.repository.js";
import {AuthError} from "../utils/errors.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token =
        authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : req.headers["x-access-token"] || req.cookies.jwt || null;
    if (!token) throw AuthError.InvalidToken();

    const decoded = verifyJwt(token) as { id: string };
    const user = await findById(decoded.id);
    if (!user) throw AuthError.InvalidToken();
    (req as any).user = user;
    next();
}
