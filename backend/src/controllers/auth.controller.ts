import type { Request, Response, NextFunction } from "express";
import * as Auth from "../services/auth.service.js";
import {AuthError} from "../utils/errors.js";

export async function register(req: Request, res: Response, next: NextFunction) {
    const result = await Auth.register(req.body);
    return res.status(201).json(result);
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const result = await Auth.login(req.body);
    return res.json(result);
}

export async function me(req: Request, res: Response) {
    const user = (req as any).user;
    if (!user) throw AuthError.UserNotFound;

    return res.json({
        user: {
            id: user.id,
            username: user.standardName ?? user.username,
            email: user.email,
        },
    });
}
