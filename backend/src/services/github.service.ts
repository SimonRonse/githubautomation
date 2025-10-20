import {
    getGitHubUserProfile,
    getUserGitHubToken,
    getOrganizations,
    getOrganization
} from "../repositories/github.repository.js";
import {AuthError, GithubError} from "../utils/errors.js";
import {findByGitHubName, setGitHubCredential} from "../repositories/auth.repository.js";
import type {User} from "@prisma/client";

export async function handleGitHubCallback(code: string): Promise<User> {
    const tokenRes = await getUserGitHubToken(code);
    const access_token = tokenRes.data.access_token;

    const userRes = await getGitHubUserProfile(access_token);
    const ghUser = userRes.data;
    if (!ghUser?.login) throw GithubError.UserNotFound

    const user = await findByGitHubName(ghUser.login);
    if (!user) throw AuthError.UserNotFound(ghUser.login);
    await setGitHubCredential(user.id, access_token);
    return user;
}

export async function getGitHubOrganizations(access_token: string) {
    const ghResponse = await getOrganizations(access_token);
    return ghResponse.data;
}

export async function getGitHubOrgDetails(orgName: string, token: string) {
    const orgRes = await getOrganization(orgName, token);
    return {
        login: orgRes.data.login,
        avatar_url: orgRes.data.avatar_url,
        description: orgRes.data.description,
    };
}

