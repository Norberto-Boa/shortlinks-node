import { sql } from "./lib/postgres";

async function setup() {
  await sql/*sql*/ `CREATE TABLE IF NOT EXISTS short_links(
    id SERIAL PRIMARY KEY,
    short_url TEXT UNIQUE,
    original_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await sql.end();

  console.log(`Done`);
}

setup();
