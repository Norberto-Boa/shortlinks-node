import postgres from "postgres";

export const sql = postgres('postgresql://admin:admin@localhost:5432/shortlinks');
