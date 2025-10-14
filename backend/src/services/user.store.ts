type User = {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    githubToken?: string | null;
};

// simple in-memory store
const users = new Map<string, User>();

export function findByUsername(username: string) {
    for (const u of users.values()) if (u.username === username) return u;
    return undefined;
}

export function findByEmail(email: string) {
    for (const u of users.values()) if (u.email === email) return u;
    return undefined;
}

export function findById(id: string) {
    return users.get(id);
}

export function saveUser(u: User) {
    users.set(u.id, u);
    console.log("GitHub user logged in:", users);
    return u;
}
