const allowedNodeEnvironments = new Set(["development", "test", "production"]);
const allowedLogLevels = new Set(["fatal", "error", "warn", "info", "debug", "trace", "silent"]);

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function validateUrl(name: string, value: string, protocols: string[]): string {
  let parsed: URL;
  try { parsed = new URL(value); } catch { throw new Error(`${name} must be a valid URL`); }
  if (!protocols.includes(parsed.protocol)) throw new Error(`${name} must use one of: ${protocols.join(", ")}`);
  return value;
}

function parseCorsOrigins(value: string, production: boolean): string[] {
  const origins = value.split(",").map((origin) => origin.trim()).filter(Boolean);
  if (origins.length === 0) throw new Error("CORS_ORIGIN must contain at least one origin");
  return origins.map((origin) => {
    validateUrl("CORS_ORIGIN", origin, ["https:", "http:"]);
    const parsed = new URL(origin);
    if (production && parsed.protocol !== "https:") throw new Error("CORS_ORIGIN must use HTTPS in production");
    return parsed.origin;
  });
}

function loadEnvironment() {
  const nodeEnv = required("NODE_ENV");
  if (!allowedNodeEnvironments.has(nodeEnv)) throw new Error("NODE_ENV must be development, test, or production");

  const databaseUrl = validateUrl("DATABASE_URL", required("DATABASE_URL"), ["postgres:", "postgresql:"]);
  const sessionSecret = required("SESSION_SECRET");
  if (sessionSecret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");

  const adminPassword = required("ADMIN_PASSWORD");
  if (adminPassword.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");

  const corsOrigins = parseCorsOrigins(required("CORS_ORIGIN"), nodeEnv === "production");
  const logLevel = process.env.LOG_LEVEL?.trim() || "info";
  if (!allowedLogLevels.has(logLevel)) throw new Error("LOG_LEVEL is invalid");

  return Object.freeze({ nodeEnv, databaseUrl, sessionSecret, adminPassword, corsOrigins, logLevel });
}

export const env = loadEnvironment();
