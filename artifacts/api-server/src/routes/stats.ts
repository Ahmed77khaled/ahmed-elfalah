import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { fail, ok } from "../lib/http.js";
import { cmsService } from "../services/cms.js";
const router=Router();
router.get("/",requireAuth,async(_req,res)=>{try{ok(res,await cmsService.getDashboardStats());}catch(error){fail(res,error);}});
export default router;
