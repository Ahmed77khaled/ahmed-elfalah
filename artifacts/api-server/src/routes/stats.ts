import { Router } from "express";
import { db, projectsTable, skillsTable, experienceTable, messagesTable } from "@workspace/db";
import { count, eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const [[projects], [skills], [experience], [messages], [unread]] = await Promise.all([
    db.select({ count: count() }).from(projectsTable),
    db.select({ count: count() }).from(skillsTable),
    db.select({ count: count() }).from(experienceTable),
    db.select({ count: count() }).from(messagesTable),
    db.select({ count: count() }).from(messagesTable).where(eq(messagesTable.read, false)),
  ]);
  res.json({
    projects: projects.count,
    skills: skills.count,
    experience: experience.count,
    messages: messages.count,
    unreadMessages: unread.count,
  });
});

export default router;
