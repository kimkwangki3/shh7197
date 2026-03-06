import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function run() {
    try {
        await db.execute(sql`ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS author_name TEXT;`);
        await db.execute(sql`ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS password TEXT;`);
        await db.execute(sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_name TEXT;`);
        await db.execute(sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS password TEXT;`);
        console.log("Success adding columns");
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

run();
