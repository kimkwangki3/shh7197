
import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function migrate() {
    try {
        console.log("Adding image_url column to boards table...");
        await db.execute(sql`ALTER TABLE boards ADD COLUMN IF NOT EXISTS image_url text;`);
        console.log("Migration successful.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
