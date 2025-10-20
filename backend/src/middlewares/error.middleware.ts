import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        console.error(`AppError: ${err.code} - ${err.message}`);
        return res.status(err.status ?? 400).json({
            error: err.code,
            message: err.message,
            context: err.context ?? null,
        });
    }

    console.error("Unhandled error:", err);
    return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: (err as any)?.message ?? "Unexpected server error",
    });
}
