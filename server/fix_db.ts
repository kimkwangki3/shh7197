import { Pool } from '@neondatabase/serverless';
import 'dotenv/config';
import ws from 'ws';

async function fix() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, webSocketConstructor: ws });
    try {
        console.log("Checking columns...");
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'votes'");
        const columns = res.rows.map(r => r.column_name);
        console.log("Current columns:", columns);

        if (!columns.includes('options')) {
            console.log("Adding options column...");
            await pool.query("ALTER TABLE votes ADD COLUMN options text[] DEFAULT '{}' NOT NULL");
        }
        if (!columns.includes('results')) {
            console.log("Adding results column...");
            await pool.query("ALTER TABLE votes ADD COLUMN results integer[] DEFAULT '{}' NOT NULL");
        }
        if (!columns.includes('allow_multiple')) {
            console.log("Adding allow_multiple column...");
            await pool.query("ALTER TABLE votes ADD COLUMN allow_multiple boolean DEFAULT false NOT NULL");
        }

        // Also check for agree_count/disagree_count to drop them if we want to clean up
        if (columns.includes('agree_count')) {
            console.log("Dropping agree_count...");
            await pool.query("ALTER TABLE votes DROP COLUMN agree_count");
        }
        if (columns.includes('disagree_count')) {
            console.log("Dropping disagree_count...");
            await pool.query("ALTER TABLE votes DROP COLUMN disagree_count");
        }

        console.log("Done!");
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
fix();
