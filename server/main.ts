import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { createTable } from "./tables/insights.ts"; 
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import insightRoutes from "./routes/insights.ts";


const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT") ?? "8000"),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");
await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new DB(dbFilePath);
db.execute(createTable);


const app = new Application();

app.use(oakCors({
  origin: [
    "http://localhost:3000", // for React dev server
    "http://localhost:5173", // in case Vite uses this port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
}));

//  Set db on context.state
app.use(async (ctx, next) => {
  ctx.state.db = db;
  await next();
});
// Register routes
app.use(insightRoutes.routes());
app.use(insightRoutes.allowedMethods());

// app.listen(env);
app.listen({ port: env.port });
console.log(`Started server on port ${env.port}`);
