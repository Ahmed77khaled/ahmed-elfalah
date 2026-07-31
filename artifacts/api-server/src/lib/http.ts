export const ok = <T>(res: any, data: T, status = 200) => res.status(status).json({ success: true, data });
export const fail = (res: any, _error: unknown, status = 500) => res.status(status).json({ success: false, error: status >= 500 ? "Internal server error" : "Request failed" });
