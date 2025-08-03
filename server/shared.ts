import type { DB } from "https://deno.land/x/sqlite/mod.ts";

export type HasDBClient = {
  db: DB;
};
