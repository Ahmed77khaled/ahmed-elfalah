import { Router } from "express";
import { db, messagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

// Admin: list all messages
router.get("/", requireAuth, async (_req, res) => {
  const rows = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
  res.json(rows);
});

// Admin: mark as read
router.put("/:id/read", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db.update(messagesTable).set({ read: true }).where(eq(messagesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

// Admin: delete message
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(messagesTable).where(eq(messagesTable.id, id));
  res.json({ ok: true });
});

export default router;
