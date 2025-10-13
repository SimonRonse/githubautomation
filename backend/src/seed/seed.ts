import { findByUsername, saveUser } from "../services/user.store.js";
import { hashPassword } from "../utils/bcrypt.js";

export async function seedTestUser() {
    const username = "teacher";
    const email = "teacher@example.com";
    const password = "passw0rd";

    if (findByUsername(username)) {
        return; // already seeded
    }

    const passwordHash = await hashPassword(password);
    saveUser({
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash,
        createdAt: new Date(),
    });

    console.log("🧪 Seeded test user:", { username, password });
}
