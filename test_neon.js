const { Pool } = require('pg'); // I will try to see if 'pg' is available in some way
// Wait, I saw it's not in node_modules/pg
// But maybe it's globally available or I can use @neondatabase/serverless as a drop-in

const { Pool: NeonPool } = require('@neondatabase/serverless');
const ws = require('ws');

async function test() {
    const pool = new NeonPool({
        connectionString: "postgresql://shh7197_db_user:Z2Zi7ukmMW71nsrQUJXHRkzbFyTTsg8k@dpg-d6jrmpp5pdvs73dhn9n0-a.oregon-postgres.render.com/shh7197_db?sslmode=require",
        webSocketConstructor: ws
    });

    try {
        console.log("Connecting...");
        const res = await pool.query("SELECT 1");
        console.log("Result:", res.rows);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}
test();
