import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import projectsRouter from "./projects.js";
import skillsRouter from "./skills.js";
import experienceRouter from "./experience.js";
import messagesRouter from "./messages.js";
import publicMessageRouter from "./public-message.js";
import settingsRouter from "./settings.js";
import statsRouter from "./stats.js";
import publicCmsRouter from "./public-cms.js";

const router = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/admin/projects", projectsRouter);
router.use("/admin/skills", skillsRouter);
router.use("/admin/experience", experienceRouter);
router.use("/admin/messages", messagesRouter);
router.use("/admin/settings", settingsRouter);
router.use("/admin/stats", statsRouter);
router.use(publicCmsRouter);
// Public: contact form submission
router.use("/messages", publicMessageRouter);

export default router;
