import app from "../artifacts/api-server/src/app";

export default function handler(req: any, res: any) {
  try {
    if (req.url && !req.url.startsWith("/api")) {
      req.url = "/api" + (req.url.startsWith("/") ? "" : "/") + req.url;
    }
    app(req, res, (err: any) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err?.message || "Express router error",
          stack: err?.stack
        });
      }
      return res.status(404).json({ success: false, error: "Route not matched" });
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Handler exception",
      stack: err?.stack
    });
  }
}
