import pg from "pg";

const { Pool } = pg;
const globalForDb = globalThis;

export function database() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not configured");
    error.statusCode = 503;
    throw error;
  }

  if (!globalForDb.portfolioPool) {
    globalForDb.portfolioPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  }
  return globalForDb.portfolioPool;
}

export async function query(sql, values = []) {
  return database().query(sql, values);
}

export function sendDatabaseError(res, error) {
  const status = error?.statusCode === 503 ? 503 : 500;
  return res.status(status).json({ success: false, error: status === 503 ? error.message : "Database request failed" });
}
