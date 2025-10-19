import type {Request, Response, NextFunction} from "express";
import { verifyJwt } from "../utils/jwt.js";
import { findById } from "../repositories/auth.repository.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token =
        authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : req.headers["x-access-token"] || req.cookies.jwt || null;
    if (!token) return res.status(401).json({ error: "MISSING_TOKEN" });
    try {
        const decoded = verifyJwt(token) as { id: string };
        const user = await findById(decoded.id);
        if (!user) return res.status(401).json({ error: "USER_NOT_FOUND" });
        (req as any).user = user;
        next();
    } catch {
        res.status(401).json({ error: "INVALID_TOKEN" });
    }
}
