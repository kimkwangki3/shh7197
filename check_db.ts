
import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function checkSchema() {
    try {
        console.log("--- Boards Table Columns ---");
        const boardsCols = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'boards';
    `);
        console.log(JSON.stringify(boardsCols.rows, null, 2));

        console.log("\n--- Promises Table Columns ---");
        const promisesCols = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'promises';
    `);
        console.log(JSON.stringify(promisesCols.rows, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
