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

users.set("test-id", {
    id: "test-id",
    username: "testuser",
    email: "testuser@example.com",
    passwordHash: "hashed-password",
    createdAt: new Date(),
    githubToken: null,
});

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
    return u;
}
