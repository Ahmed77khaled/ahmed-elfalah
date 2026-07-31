import pino from "pino";
import { env } from "./env.js";

const isProduction = env.nodeEnv === "production";

export const logger = pino({
  level: env.logLevel,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "req.body.password",
    "req.body.token",
    "req.body.accessToken",
    "req.body.refreshToken",
  ],
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
