// import type { HasDBClient } from "../shared.ts";
// import type { Insert, Row } from "$tables/insights.ts";
// import { insertStatement } from "$tables/insights.ts";

// export type CreateInsightInput = {
//   brand: number;
//   text: string;
// };

// export default (input: HasDBClient & CreateInsightInput): Row => {
//   const createdAt = new Date().toISOString();

//   const insert: Insert = {
//     brand: input.brand,
//     createdAt,
//     text: input.text,
//   };

//   const sql = insertStatement(insert);
//   input.db.execute(sql);

//   // SQLite will auto-increment the ID, so get the last inserted ID
//   const [row] = input.db.sql<Row>(`
//     SELECT * FROM insights 
//     WHERE rowid = last_insert_rowid()
//   `);

//   return {
//     ...row,
//     createdAt: new Date(row.createdAt).toISOString(),
//   };
// };

import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { type Insert, insertStatement } from "../tables/insights.ts";
import { Database } from "@db/sqlite"; // Adjust if needed based on your db import

export default function createInsight({ db, item }: { db: DB; item: Insert }) {
  const sql = insertStatement(item);
  db.query(sql);
  return { success: true };
}

