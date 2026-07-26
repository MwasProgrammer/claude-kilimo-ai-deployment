import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set. Copy .env.example to .env and fill it in."
  );
}

// If you're on Supabase: use the "Connection pooling" string (port 6543,
// host like aws-0-<region>.pooler.supabase.com), not the direct db host.
// The direct host frequently fails to resolve from serverless/cloud runners.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL?.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (err) => {
  console.error("[db] Unexpected error on idle client", err);
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (process.env.NODE_ENV !== "production") {
    console.log("[db]", text.split("\n")[0], `${Date.now() - start}ms`, `rows=${res.rowCount}`);
  }
  return res;
}
