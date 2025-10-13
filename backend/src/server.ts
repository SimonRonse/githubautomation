import dotenv from "dotenv";
import app from "./app.js";
import { seedTestUser } from "./seed/seed.js";

dotenv.config();

async function main() {
    await seedTestUser(); // <-- create teacher/passw0rd if not present
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => {
        console.log(`✅ API listening on http://localhost:${port}`);
    });
}

main().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
