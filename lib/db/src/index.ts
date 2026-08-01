import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema/index.js";

const { Pool } = pg;

export const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : (null as any);
export const db = pool ? drizzle(pool, { schema }) : (null as any);

export * from "./schema/index.js";
export { eq, asc, desc, count, and } from "drizzle-orm";
