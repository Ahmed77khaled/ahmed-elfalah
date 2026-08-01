import { Router } from "express";
import { db, settingsTable, eq } from "@workspace/db";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const rows = await db.select().from(settingsTable);
  // Return as a flat key→value object for convenience
  const obj: Record<string, string> = {};
  for (const row of rows) obj[row.key] = row.value;
  res.json(obj);
});

router.put("/", requireAuth, async (req, res) => {
  const updates = req.body as Record<string, string>;
  if (typeof updates !== "object" || Array.isArray(updates)) {
    res.status(400).json({ error: "Body must be a key-value object" });
    return;
  }
  for (const [key, value] of Object.entries(updates)) {
    await db
      .insert(settingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: settingsTable.key, set: { value, updatedAt: new Date() } });
  }
  res.json({ ok: true });
});

export default router;
