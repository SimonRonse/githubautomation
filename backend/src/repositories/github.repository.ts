import axios from "axios";
import {GithubError} from "../utils/errors.js";

export async function getGitHubUserProfile(access_token: string) {
    return axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
    }).catch(err => {
        console.error("GitHub user profile error:", err.response?.status, err.response?.data);
        throw GithubError.ApiError("GitHub user profile fetch failed");
    });
}

export async function getUserGitHubToken(code: string) {
    return axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        },
        { headers: { Accept: "application/json" } }
    ).catch(err => {
        console.error("GitHub token exchange error:", err.response?.status, err.response?.data);
        throw GithubError.ApiError("GitHub access token exchange failed");
    })
}

export async function getOrganizations(access_token: string) {
    return axios.get("https://api.github.com/user/orgs", {
        headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "painautomationgithub-App",
        },
    }).catch(err => {
        console.error("GitHub API error:", err.response?.status, err.response?.data);
        throw GithubError.ApiError("GitHub API error while fetching organizations");
    });
}

export async function getOrganization(orgName: string, token: string) {
    return axios.get(`https://api.github.com/orgs/${orgName}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "painautomationgithub-App",
        },
    }).catch(err => {
        console.error("GitHub organization fetch error:", err.response?.status, err.response?.data);
        throw GithubError.ApiError(`GitHub API error while fetching organization ${orgName}`);
    });
}

export async function createGithubRepo(token: string, org: string, name: string, options: any) {
    return axios.post(`https://api.github.com/orgs/${org}/repos`, {
        name,
        ...options
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "painautomationgithub-App"
        },
    }).catch(err => {
        console.error("GitHub repository creation error: Does your organization exists and is in the github app?");
        throw GithubError.ApiError(`Internal Error calling github: Ask your teacher`);
    });
}

export async function addCollaborator(token: string, org: string, repo: string, username: string) {
    return axios.put(`https://api.github.com/repos/${org}/${repo}/collaborators/${username}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "painautomationgithub-App"
        },
    }).catch(err => {
        console.error("GitHub add collaborator error:", err.response?.status, err.response?.data);
        throw GithubError.ApiError(`GitHub API error while adding collaborator ${username} to repository ${repo} in organization ${org}`);
    });
}
export async function githubUserExists(token: string, username: string): Promise<boolean> {
    return axios.get(`https://api.github.com/users/${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "painautomationgithub-App"
        },
    }).then(() => true).catch(err => {
        if (err.response && err.response.status === 404) {
            return false;
        }
        console.error("GitHub user existence check error:", err.response?.status, err.response?.data);
        throw GithubError.ApiError(`GitHub API error while checking existence of user ${username}`);
    });
}