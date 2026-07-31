import type { Response } from "express";
export const ok = <T>(res: Response, data: T, status = 200) => res.status(status).json({ success: true, data });
export const fail = (res: Response, _error: unknown, status = 500) => res.status(status).json({ success: false, error: status >= 500 ? "Internal server error" : "Request failed" });
