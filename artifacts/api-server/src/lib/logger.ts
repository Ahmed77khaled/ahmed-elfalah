import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: env.logLevel || "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
    "req.body.password",
    "req.body.token",
    "req.body.accessToken",
    "req.body.refreshToken",
  ],
});
