import { Router } from "express";
import { insertMessageSchema } from "@workspace/db";
import { fail, ok } from "../lib/http.js";
import { cmsService } from "../services/cms.js";

const router = Router();
router.post("/", async (req: any, res: any) => {
  const parsed = insertMessageSchema.safeParse(req.body as any);
  if (!parsed.success) return void fail(res, "Invalid message", 400);
  try {
    ok(res, await cmsService.createMessage(parsed.data), 201);
  } catch (error) {
    fail(res, error);
  }
});

export default router;
