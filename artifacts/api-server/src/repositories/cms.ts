import { db, experienceTable, messagesTable, projectsTable, skillsTable, and, asc, count, desc, eq } from "../../../../lib/db/src/index";

export const cmsRepository = {
  projects: (publishedOnly = false) => db.select().from(projectsTable)
    .where(publishedOnly ? eq(projectsTable.status, "published") : undefined)
    .orderBy(asc(projectsTable.displayOrder), asc(projectsTable.id)),
  skills: (visibleOnly = false) => db.select().from(skillsTable)
    .where(visibleOnly ? eq(skillsTable.visible, true) : undefined)
    .orderBy(asc(skillsTable.displayOrder), asc(skillsTable.id)),
  experience: () => db.select().from(experienceTable).orderBy(asc(experienceTable.displayOrder), asc(experienceTable.id)),
  messages: () => db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt)),
  createMessage: (data: typeof messagesTable.$inferInsert) => db.insert(messagesTable).values(data).returning(),
  createProject: (data: typeof projectsTable.$inferInsert) => db.insert(projectsTable).values(data).returning(),
  updateProject: (id: number, data: Partial<typeof projectsTable.$inferInsert>) => db.update(projectsTable).set({ ...data, updatedAt: new Date() }).where(eq(projectsTable.id, id)).returning(),
  deleteProject: (id: number) => db.delete(projectsTable).where(eq(projectsTable.id, id)).returning({ id: projectsTable.id }),
  createSkill: (data: typeof skillsTable.$inferInsert) => db.insert(skillsTable).values(data).returning(),
  updateSkill: (id: number, data: Partial<typeof skillsTable.$inferInsert>) => db.update(skillsTable).set(data).where(eq(skillsTable.id, id)).returning(),
  deleteSkill: (id: number) => db.delete(skillsTable).where(eq(skillsTable.id, id)).returning({ id: skillsTable.id }),
  createExperience: (data: typeof experienceTable.$inferInsert) => db.insert(experienceTable).values(data).returning(),
  updateExperience: (id: number, data: Partial<typeof experienceTable.$inferInsert>) => db.update(experienceTable).set(data).where(eq(experienceTable.id, id)).returning(),
  deleteExperience: (id: number) => db.delete(experienceTable).where(eq(experienceTable.id, id)).returning({ id: experienceTable.id }),
  markMessageRead: (id: number) => db.update(messagesTable).set({ read: true }).where(eq(messagesTable.id, id)).returning(),
  deleteMessage: (id: number) => db.delete(messagesTable).where(eq(messagesTable.id, id)).returning({ id: messagesTable.id }),
  stats: async () => {
    const [[projects], [skills], [experience], [messages], [unread]] = await Promise.all([
      db.select({ count: count() }).from(projectsTable), db.select({ count: count() }).from(skillsTable),
      db.select({ count: count() }).from(experienceTable), db.select({ count: count() }).from(messagesTable),
      db.select({ count: count() }).from(messagesTable).where(eq(messagesTable.read, false)),
    ]);
    return { projects: projects.count, skills: skills.count, experience: experience.count, messages: messages.count, unreadMessages: unread.count };
  },
};
