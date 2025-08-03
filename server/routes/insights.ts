
import { Router } from "https://deno.land/x/oak/mod.ts";
import lookupInsight from "../operations/lookup-insight.ts";
import createInsight from "../operations/create-insight.ts";

const router = new Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const db = ctx.state.db;
  const rows = [
    ...db.query("SELECT id, brand, createdAt, text FROM insights"),
  ];

  const data = rows.map(([id, brandId, createdAt, text]) => ({
    id,
    brandId,
    date: createdAt,
    text,
  }));

  ctx.response.body = data;
});

router.get("/insights/:id", (ctx) => {
  const db = ctx.state.db;
  const { id } = ctx.params;
  const result = lookupInsight({ db, id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx) => {
  const db = ctx.state.db;
  try {
    const data = await ctx.request.body.json();
    const item = {
      brand: data.brand,
      createdAt: data.createdAt ?? new Date().toISOString(),
      text: data.text,
    };

    const result = await createInsight({ db, item });

    ctx.response.status = 201;
    ctx.response.body = result;
  } catch (error) {
    console.error("POST /insights failed:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
});

router.delete("/insights/:id", async (ctx) => {
  const db = ctx.state.db;
  const id = Number(ctx.params.id);
  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid ID" };
    return;
  }

  db.query("DELETE FROM insights WHERE id = ?", [id]);
  ctx.response.status = 204;
});

export default router;
