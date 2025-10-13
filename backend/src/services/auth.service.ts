import { z } from "zod";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signJwt } from "../utils/jwt.js";
import { findByEmail, findByUsername, saveUser } from "./user.store.js";

const RegisterSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
});

const LoginSchema = z.object({
    usernameOrEmail: z.string().min(3),
    password: z.string().min(6),
});

export async function register(input: unknown) {
    const { username, email, password } = RegisterSchema.parse(input);

    if (findByUsername(username)) throw new Error("USERNAME_TAKEN");
    if (findByEmail(email)) throw new Error("EMAIL_TAKEN");

    const passwordHash = await hashPassword(password);
    const user = saveUser({
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash,
        createdAt: new Date(),
    });

    const token = signJwt({ sub: user.id, username: user.username });
    return { token, user: { id: user.id, username: user.username, email: user.email } };
}

export async function login(input: unknown) {
    const { usernameOrEmail, password } = LoginSchema.parse(input);

    const user =
        findByUsername(usernameOrEmail) || findByEmail(usernameOrEmail);
    if (!user) throw new Error("USER_NOT_FOUND");

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new Error("INCORRECT_PASSWORD");

    const token = signJwt({ sub: user.id, username: user.username });
    return { token, user: { id: user.id, username: user.username, email: user.email } };
}