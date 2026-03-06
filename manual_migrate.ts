import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function migrate() {
    try {
        console.log("Starting manual migration...");

        // 1. Suggestions table
        console.log("Migrating suggestions table...");
        await db.execute(sql`ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS ip_address text;`);
        // author_name and password might already exist, we keep them for now or drop them
        // To match shared/schema.ts, we should eventually drop them.
        // But let's check if they exist first to avoid errors.

        // 2. Comments table
        console.log("Migrating comments table...");
        await db.execute(sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS ip_address text;`);

        // Optionally drop old columns if you are sure
        // await db.execute(sql`ALTER TABLE suggestions DROP COLUMN IF EXISTS author_name;`);
        // await db.execute(sql`ALTER TABLE suggestions DROP COLUMN IF EXISTS password;`);
        // await db.execute(sql`ALTER TABLE comments DROP COLUMN IF EXISTS author_name;`);
        // await db.execute(sql`ALTER TABLE comments DROP COLUMN IF EXISTS password;`);

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
