import { Router } from "express";
import { fail, ok } from "../lib/http.js";
import { cmsService } from "../services/cms.js";
const router=Router();
router.get("/projects",async(_req,res)=>{try{ok(res,await cmsService.getProjects(true));}catch(e){fail(res,e);}});
router.get("/skills",async(_req,res)=>{try{ok(res,await cmsService.getSkills(true));}catch(e){fail(res,e);}});
router.get("/experience",async(_req,res)=>{try{ok(res,await cmsService.getExperience());}catch(e){fail(res,e);}});
export default router;
