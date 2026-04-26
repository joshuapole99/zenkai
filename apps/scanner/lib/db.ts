import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!_sql) _sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
  return _sql;
}
