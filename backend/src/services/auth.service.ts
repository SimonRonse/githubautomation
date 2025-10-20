import { z } from "zod";
import axios from "axios";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signJwt } from "../utils/jwt.js";
import {findByEmail, findByGitHubName, findByUsername, saveUser, setGitHubCredential} from "../repositories/auth.repository.js";
import {AuthError} from "../utils/errors.js";

const RegisterSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
});

const LoginSchema = z.object({
    usernameOrEmail: z.string().min(3),
    password: z.string().min(6),
    githubToken: z.string().min(12),
});

export async function register(input: unknown) {
    const { username, email, password } = RegisterSchema.parse(input);

    if (await findByUsername(username)) throw AuthError.UserExists(username);
    if (await findByEmail(email)) throw AuthError.UserExists(email);
    const passwordHash = await hashPassword(password);
    const user = await saveUser({
        username,
        email,
        passwordHash,
    });

    const token = signJwt({ id: user.id, username: user.standardName });
    return { token, user: { id: user.id, username: user.standardName, email: user.email } };
}

export async function login(input: unknown) {
    const { usernameOrEmail, password, githubToken} = LoginSchema.parse(input);

    const user =
        await findByUsername(usernameOrEmail) || await findByEmail(usernameOrEmail);
    if (!user) throw AuthError.UserNotFound(usernameOrEmail);

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw AuthError.IncorrectPassword();

    await setGitHubCredential(user.id, githubToken);
    const token = signJwt({ id: user.id, username: user.standardName });
    return { token, user: { id: user.id, username: user.standardName, email: user.email } };
}