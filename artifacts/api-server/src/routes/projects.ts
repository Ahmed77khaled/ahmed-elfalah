import { Router } from "express";
import { insertProjectSchema } from "../../../../lib/db/src/index";
import { requireAuth } from "../lib/auth.js";
import { fail, ok } from "../lib/http.js";
import { cmsService, NotFoundError } from "../services/cms.js";

const router = Router();
const id = (value: string) => Number.isSafeInteger(Number(value)) ? Number(value) : null;
const run = (handler: (req: any, res: any) => Promise<void>) => (req: any, res: any) => handler(req, res).catch((error) => fail(res, error, error instanceof NotFoundError ? 404 : 500));

router.get("/", requireAuth, run(async (_req, res) => { ok(res, await cmsService.getProjects()); }));
router.post("/", requireAuth, run(async (req, res) => { const parsed = (insertProjectSchema.safeParse as any)(req.body); if (!parsed.success) return void fail(res, "Invalid project", 400); ok(res, await cmsService.createProject(parsed.data), 201); }));
router.put("/:id", requireAuth, run(async (req, res) => { const projectId = id(req.params.id); if (projectId === null) return void fail(res, "Invalid project id", 400); const parsed = (insertProjectSchema.partial().safeParse as any)(req.body); if (!parsed.success) return void fail(res, "Invalid project", 400); ok(res, await cmsService.updateProject(projectId, parsed.data)); }));
router.delete("/:id", requireAuth, run(async (req, res) => { const projectId = id(req.params.id); if (projectId === null) return void fail(res, "Invalid project id", 400); await cmsService.deleteProject(projectId); ok(res, { id: projectId }); }));

export default router;
