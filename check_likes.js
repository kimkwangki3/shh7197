const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkLikes() {
    try {
        const res = await pool.query("SELECT * FROM likes WHERE target_type = 'vote' ORDER BY created_at DESC LIMIT 20");
        console.log("Likes found:", res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkLikes();
