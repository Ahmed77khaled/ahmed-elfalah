import { Router } from "express";
import { db, projectsTable, insertProjectSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const rows = await db.select().from(projectsTable).orderBy(asc(projectsTable.displayOrder), asc(projectsTable.id));
  res.json(rows);
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = insertProjectSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertProjectSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const [row] = await db.update(projectsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projectsTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.json({ ok: true });
});

export default router;
