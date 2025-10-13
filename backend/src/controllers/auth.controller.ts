import type { Request, Response, NextFunction } from "express";
import * as Auth from "../services/auth.service.js";
import { verifyJwt } from "../utils/jwt.js";
import { findById } from "../services/user.store.js";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await Auth.register(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        if (err?.message === "USERNAME_TAKEN" || err?.message === "EMAIL_TAKEN")
            return res.status(409).json({ error: err.message });
        if (err?.name === "ZodError")
            return res.status(400).json({ error: "VALIDATION_ERROR", details: err.errors });
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await Auth.login(req.body);
        return res.json(result);
    } catch (err: any) {
        if (err?.message === "USER_NOT_FOUND" || err?.message === "INCORRECT_PASSWORD")
            return res.status(401).json({ error: err.message });
        if (err?.name === "ZodError")
            return res.status(400).json({ error: "VALIDATION_ERROR", details: err.errors });
        next(err);
    }
}

export async function me(req: Request, res: Response) {
    const auth = req.headers.authorization?.split(" ")[1];
    if (!auth) return res.status(401).json({ error: "NO_TOKEN" });
    try {
        const payload = verifyJwt(auth);
        const user = findById(payload.sub);
        if (!user) return res.status(401).json({ error: "INVALID_TOKEN" });
        res.json({ id: user.id, username: user.username, email: user.email });
    } catch {
        res.status(401).json({ error: "INVALID_TOKEN" });
    }
}
