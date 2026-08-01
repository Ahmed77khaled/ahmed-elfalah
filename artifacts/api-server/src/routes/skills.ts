import { Router } from "express";
import { insertSkillSchema } from "@workspace/db";
import { requireAuth } from "../lib/auth.js";
import { fail, ok } from "../lib/http.js";
import { cmsService, NotFoundError } from "../services/cms.js";

const router = Router();
const id = (v: string) => Number.isSafeInteger(Number(v)) ? Number(v) : null;
const run = (handler: (req: any, res: any) => Promise<void>) => (req: any, res: any) => handler(req, res).catch((e) => fail(res, e, e instanceof NotFoundError ? 404 : 500));

router.get("/", requireAuth, run(async (_req, res) => { ok(res, await cmsService.getSkills()); }));
router.post("/", requireAuth, run(async (req, res) => { const parsed = (insertSkillSchema.safeParse as any)(req.body); if (!parsed.success) return void fail(res, "Invalid skill", 400); ok(res, await cmsService.createSkill(parsed.data), 201); }));
router.put("/:id", requireAuth, run(async (req, res) => { const skillId = id(req.params.id); if (skillId === null) return void fail(res, "Invalid skill id", 400); const parsed = (insertSkillSchema.partial().safeParse as any)(req.body); if (!parsed.success) return void fail(res, "Invalid skill", 400); ok(res, await cmsService.updateSkill(skillId, parsed.data)); }));
router.delete("/:id", requireAuth, run(async (req, res) => { const skillId = id(req.params.id); if (skillId === null) return void fail(res, "Invalid skill id", 400); await cmsService.deleteSkill(skillId); ok(res, { id: skillId }); }));

export default router;
