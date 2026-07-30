import { Router } from "express";
import { db, skillsTable, insertSkillSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const rows = await db.select().from(skillsTable).orderBy(asc(skillsTable.displayOrder), asc(skillsTable.id));
  res.json(rows);
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = insertSkillSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.insert(skillsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertSkillSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.update(skillsTable).set(parsed.data).where(eq(skillsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(skillsTable).where(eq(skillsTable.id, id));
  res.json({ ok: true });
});

export default router;
