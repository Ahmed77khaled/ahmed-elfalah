import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { fail, ok } from "../lib/http.js";
import { cmsService, NotFoundError } from "../services/cms.js";
const router=Router(); const id=(v:string)=>Number.isSafeInteger(Number(v))?Number(v):null; const run=(h:(req:any,res:any)=>Promise<void>)=>(req:any,res:any)=>h(req,res).catch((e)=>fail(res,e,e instanceof NotFoundError?404:500));
router.get("/",requireAuth,run(async(_req,res)=>{ok(res,await cmsService.getMessages());}));
router.put("/:id/read",requireAuth,run(async(req,res)=>{const messageId=id(req.params.id);if(messageId===null)return void fail(res,"Invalid message id",400);ok(res,await cmsService.markMessageRead(messageId));}));
router.delete("/:id",requireAuth,run(async(req,res)=>{const messageId=id(req.params.id);if(messageId===null)return void fail(res,"Invalid message id",400);await cmsService.deleteMessage(messageId);ok(res,{id:messageId});}));
export default router;
