import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export default async function createUser() {
    const email = process.env.USER_EMAIL!;
    const password = process.env.USER_PASSWORD!;
    const standardName = process.env.USER_NAME!;
    const githubName = process.env.GITHUB_ALLOWED_USER || null;

    console.log("🔹 Seeding authorized user:", email);

    const passwordHash = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("⚠️ User already exists — skipping creation.");
    } else {
        await prisma.user.create({
            data: {
                email,
                passwordHash,
                standardName,
                githubName,
            },
        });
        console.log("✅ Authorized user created successfully!");
    }
}
