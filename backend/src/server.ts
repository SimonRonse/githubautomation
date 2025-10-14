import dotenv from "dotenv";
import app from "./app.js";
import createUser from "./seed/seed.js";
import {prisma} from "./db/prisma.js";

dotenv.config();

async function main() {
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => {
        console.log(`✅ API listening on http://localhost:${port}`);
    });
}

await createUser()
    .catch((err) => {
        console.error("❌ Seed error:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

main().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
