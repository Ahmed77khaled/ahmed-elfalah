import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttpModule from "pino-http";
import { env } from "./lib/env.js";
import { logger } from "./lib/logger.js";
import router from "./routes/index.js";

const pinoHttp = (pinoHttpModule as any).default || pinoHttpModule;
const app = express();

if (env.nodeEnv === "production") app.set("trust proxy", 1);

try {
  if (typeof pinoHttp === "function") {
    app.use(
      pinoHttp({
        logger,
        serializers: {
          req(req: any) {
            return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
          },
          res(res: any) {
            return { statusCode: res.statusCode };
          },
        },
      }),
    );
  }
} catch (e) {
  logger.warn({ err: e }, "pino-http middleware init skipped");
}

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
  origin(origin: any, callback: any) {
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

try {
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false }));
  app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false }));
  app.use("/api/messages", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false }));
} catch (e) {
  logger.warn({ err: e }, "rateLimit middleware init skipped");
}

app.use("/api", router);
app.use((_req: any, res: any) => res.status(404).json({ success: false, error: "Not found" }));
app.use((error: any, req: any, res: any, _next: any) => {
  if (res.headersSent) return;
  const status = error.type === "entity.too.large" ? 413 : error.statusCode ?? error.status ?? 500;
  const requestId = req.id;
  logger.error({ err: error, requestId, status }, "Request failed");
  const safeStatus = status >= 400 && status < 600 ? status : 500;
  const message = safeStatus === 413 ? "Request body too large" : safeStatus < 500 ? "Request rejected" : "Internal server error";
  res.status(safeStatus).json({ success: false, error: message });
});

export default app;
