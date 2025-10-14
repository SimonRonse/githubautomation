import { z } from "zod";
import axios from "axios";
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
function ensureGitHubEnv() {
    const required = [
        "GITHUB_CLIENT_ID",
        "GITHUB_CLIENT_SECRET",
        "GITHUB_REDIRECT_URI",
        "GITHUB_ALLOWED_USER",
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length)
        throw new Error(`Missing GitHub OAuth environment variables: ${missing.join(", ")}`);
}

export function getGitHubLoginUrl(): string {
    ensureGitHubEnv();
    const redirectUri = encodeURIComponent(process.env.GITHUB_REDIRECT_URI!);
    return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=read:user,user:email`;
}

export async function handleGitHubCallback(code: string): Promise<string> {
    ensureGitHubEnv();

    // 1️⃣ Exchange code for access token
    const tokenRes = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        },
        { headers: { Accept: "application/json" } }
    );

    if (!tokenRes.data.access_token)
        throw new Error("GitHub access token exchange failed");

    const access_token = tokenRes.data.access_token;

    // 2️⃣ Fetch user profile
    const userRes = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    const ghUser = userRes.data;
    if (!ghUser?.login) throw new Error("Invalid GitHub user data");

    // 3️⃣ Restrict login to allowed account
    if (ghUser.login !== process.env.GITHUB_ALLOWED_USER)
        throw new Error("Unauthorized GitHub account");

    const user = {
        id: ghUser.id,
        username: ghUser.login,
        email: ghUser.email,
    };

    saveUser({
        id: ghUser.id,
        username: ghUser.login,
        email: ghUser.email ?? `${ghUser.login}@github.com`,
        passwordHash: "",
        createdAt: new Date(),
        githubToken: access_token,
    });
    // 4️⃣ Return signed JWT for frontend
    return signJwt({ sub: user.id, username: user.username });
}