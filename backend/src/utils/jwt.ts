import jwt from "jsonwebtoken";
import type { SignOptions, JwtPayload as StdJwtPayload } from "jsonwebtoken";

export type JwtClaims = { sub: string; username: string };

const SECRET: string = process.env.JWT_SECRET || "dev-secret";

export function signJwt(
    payload: JwtClaims,
    opts: SignOptions = { expiresIn: "1d", algorithm: "HS256" }
): string {
    return jwt.sign(payload, SECRET, opts);
}

export function verifyJwt<T extends object = JwtClaims>(token: string): T {
    const decoded = jwt.verify(token, SECRET);
    if (typeof decoded === "string") {
        throw new Error("INVALID_TOKEN_PAYLOAD");
    }
    // decoded is StdJwtPayload | object
    return decoded as T;
}
