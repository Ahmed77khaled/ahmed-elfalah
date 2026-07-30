import { Router } from "express";
import { db, messagesTable, insertMessageSchema } from "@workspace/db";

const router = Router();

// Public: receive contact form submissions
router.post("/", async (req, res) => {
  const parsed = insertMessageSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  await db.insert(messagesTable).values(parsed.data);
  res.status(201).json({ ok: true });
});

export default router;
