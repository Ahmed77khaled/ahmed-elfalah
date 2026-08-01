import pg from "pg";
import { readFileSync } from "fs";

const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

const sql = readFileSync("./db/init.sql", "utf8");

console.log("🔗 Connecting to Supabase...");
await client.connect();
console.log("✅ Connected!");

console.log("🚀 Running init.sql...");
await client.query(sql);
console.log("✅ Database initialized successfully!");

await client.end();
console.log("🎉 Done!");
