export interface ErrorPayload {
    message: string;
    code?: string;
    context?: any;
    status?: number;
}

/**
 * Base application error used by all domain errors.
 */
export class AppError extends Error {
    public code: string;
    public context?: any;
    public status: number;

    constructor({ message, code = "APP_ERROR", context, status = 400 }: ErrorPayload) {
        super(message);
        this.code = code;
        this.context = context;
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class GithubError extends AppError {
    static ApiError = (detail: string) =>
        new GithubError({ message: detail, code: "GITHUB_API_ERROR", status: 502 });

    static UserNotFound = (username: string) =>
        new GithubError({ message: `GitHub user not found: ${username}`, code: "GITHUB_USER_NOT_FOUND", context: { username }, status: 404 });

    static RateLimitExceeded = () =>
        new GithubError({ message: "GitHub API rate limit exceeded", code: "GITHUB_RATE_LIMIT", status: 429 });

    static RepoCreationFailed = (detail: string) =>
        new GithubError({ message: `GitHub repository creation failed: ${detail}`, code: "GITHUB_REPO_CREATION_FAILED", status: 500 });

    static RepoNotFound = (repo: string) =>
        new GithubError({ message: `GitHub repository not found: ${repo}`, code: "GITHUB_REPO_NOT_FOUND", context: { repo }, status: 404 });

    constructor(payload: ErrorPayload) {
        super({ ...payload, code: payload.code ?? "GITHUB_ERROR" });
    }
}

export class AuthError extends AppError {
    static NoToken = () =>
        new AuthError({ message: "No token provided", code: "AUTH_NO_TOKEN", status: 401 });

    static Unauthorized = () =>
        new AuthError({ message: "Unauthorized access", code: "AUTH_UNAUTHORIZED", status: 401 });

    static InvalidToken = () =>
        new AuthError({ message: "Invalid or expired token", code: "AUTH_INVALID", status: 401 });

    static UserNotFound = (userId: string) =>
        new AuthError({ message: `User not found: ${userId}`, code: "AUTH_USER_NOT_FOUND", context: { userId }, status: 404 });

    static IncorrectPassword = () =>
        new AuthError({ message: "Incorrect password", code: "AUTH_INCORRECT_PASSWORD", status: 401 });

    static UserExists = (identifier: string) =>
        new AuthError({ message: `User already exists: ${identifier}`, code: "AUTH_USER_EXISTS", context: { identifier }, status: 409 });

    constructor(payload: ErrorPayload) {
        super({ ...payload, code: payload.code ?? "AUTH_ERROR" });
    }
}

export class ProjectError extends AppError {
    static Missing = (detail: string) =>
        new ProjectError({ message: detail, code: "PROJECT_MISSING", status: 404 });

    static UnauthorizedAccess = (projectId: string) =>
        new ProjectError({ message: `Unauthorized access to project: ${projectId}`, code: "PROJECT_UNAUTHORIZED", context: { projectId }, status: 403 });

    static Invalid = (key: string) =>
        new ProjectError({ message: `Invalid project key: ${key}`, code: "PROJECT_INVALID", context: { key }, status: 404 });

    constructor(payload: ErrorPayload) {
        super({ ...payload, code: payload.code ?? "PROJECT_ERROR" });
    }
}

export class GroupError extends AppError {
    static Min = (min: number, given: number) =>
        new GroupError({ message: `Minimum group size is ${min} (You only provided ${given})`, code: "GROUP_MIN", context: { min } });

    static Max = (max: number, given: number) =>
        new GroupError({ message: `Maximum group size is ${max} (You provided ${given})`, code: "GROUP_MAX", context: { max } });

    static Student = (name: string) =>
        new GroupError({ message: `Invalid student: ${name}`, code: "GROUP_STUDENT", context: { name } });

    static Github = (username: string) =>
        new GroupError({ message: `GitHub user not found: ${username}`, code: "GROUP_GITHUB", context: { username } });

    constructor(payload: ErrorPayload) {
        super({ ...payload, code: payload.code ?? "GROUP_ERROR" });
    }
}

export class ServerError extends AppError {
    static Internal = (detail?: string) =>
        new ServerError({ message: detail || "Internal server error", code: "SERVER_INTERNAL", status: 500 });

    constructor(payload: ErrorPayload) {
        super({ ...payload, code: payload.code ?? "SERVER_ERROR" });
    }
}