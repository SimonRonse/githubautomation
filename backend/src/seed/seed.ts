import { findByUsername, saveUser } from "../services/user.store.js";
import { hashPassword } from "../utils/bcrypt.js";

export async function seedTestUser() {
    const username = "painyce";
    const email = "teacher@example.com";
    const password = "(Bt<3do.(ucVwJDf";

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
