import { Router } from "express";
import { insertExperienceSchema } from "@workspace/db";
import { requireAuth } from "../lib/auth.js";
import { fail, ok } from "../lib/http.js";
import { cmsService, NotFoundError } from "../services/cms.js";

const router = Router();
const id = (v: string) => Number.isSafeInteger(Number(v)) ? Number(v) : null;
const run = (h: (req: any, res: any) => Promise<void>) => (req: any, res: any) => h(req, res).catch((e) => fail(res, e, e instanceof NotFoundError ? 404 : 500));

router.get("/", requireAuth, run(async (_req, res) => { ok(res, await cmsService.getExperience()); }));
router.post("/", requireAuth, run(async (req, res) => { const p = (insertExperienceSchema.safeParse as any)(req.body); if (!p.success) return void fail(res, "Invalid experience", 400); ok(res, await cmsService.createExperience(p.data), 201); }));
router.put("/:id", requireAuth, run(async (req, res) => { const itemId = id(req.params.id); if (itemId === null) return void fail(res, "Invalid experience id", 400); const p = (insertExperienceSchema.partial().safeParse as any)(req.body); if (!p.success) return void fail(res, "Invalid experience", 400); ok(res, await cmsService.updateExperience(itemId, p.data)); }));
router.delete("/:id", requireAuth, run(async (req, res) => { const itemId = id(req.params.id); if (itemId === null) return void fail(res, "Invalid experience id", 400); await cmsService.deleteExperience(itemId); ok(res, { id: itemId }); }));

export default router;
