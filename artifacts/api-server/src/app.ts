import express, { type Application, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import { env } from "./lib/env.js";
import { logger } from "./lib/logger.js";
import router from "./routes/index.js";

const app: Application = express();

if (env.nodeEnv === "production") app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: "same-site" },
  referrerPolicy: { policy: "no-referrer" },
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    const error = Object.assign(new Error("Origin is not allowed"), { status: 403 });
    return callback(error);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
  maxAge: 600,
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false }));
app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false }));
app.use("/api/messages", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false }));

app.use("/api", router);
app.use("/api", (_req, res) => res.status(404).json({ success: false, error: "Not found" }));
app.use((error: Error & { type?: string; status?: number; statusCode?: number }, req: Request, res: Response, _next: NextFunction) => {
  if (res.headersSent) return;
  const status = error.type === "entity.too.large" ? 413 : error.statusCode ?? error.status ?? 500;
  const requestId = (req as Request & { id?: string }).id;
  logger.error({ err: error, requestId, status }, "Request failed");
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  const message = safeStatus === 413 ? "Request body too large" : safeStatus < 500 ? "Request rejected" : "Internal server error";
  res.status(safeStatus).json({ success: false, error: message });
});

export default app;
