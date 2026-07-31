import { Router } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import skillsRouter from "./skills";
import experienceRouter from "./experience";
import messagesRouter from "./messages";
import publicMessageRouter from "./public-message";
import settingsRouter from "./settings";
import statsRouter from "./stats";
import publicCmsRouter from "./public-cms";

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
