import { z } from "zod";
import axios from "axios";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signJwt } from "../utils/jwt.js";
import {findByEmail, findByGitHubName, findByUsername, saveUser, setGitHubCredential} from "../repositories/auth.repository.js";

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

    if (await findByUsername(username)) throw new Error("USERNAME_TAKEN");
    if (await findByEmail(email)) throw new Error("EMAIL_TAKEN");
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
    if (!user) throw new Error("USER_NOT_FOUND");

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new Error("INCORRECT_PASSWORD");

    await setGitHubCredential(user.id, githubToken);
    const token = signJwt({ id: user.id, username: user.standardName });
    return { token, user: { id: user.id, username: user.standardName, email: user.email } };
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

    const user = await findByGitHubName(ghUser.login);
    if (!user) throw new Error("GitHub user not registered in the system");
    await setGitHubCredential(user.id, access_token);
    // 4️⃣ Return signed JWT for frontend
    return signJwt({ id: user.id, username: user.standardName });
}