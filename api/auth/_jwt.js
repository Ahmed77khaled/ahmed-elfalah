import crypto from "node:crypto";

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function timingSafeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function signAdminToken() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");

  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({ role: "admin", exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 });
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export function requireAdmin(req, res) {
  const secret = process.env.SESSION_SECRET;
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const [header, payload, signature] = token.split(".");

  if (!secret || !header || !payload || !signature) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!timingSafeEqual(signature, expected) || claims.role !== "admin" || claims.exp * 1000 <= Date.now()) {
      res.status(401).json({ error: "Unauthorized" });
      return false;
    }
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }

  return true;
}
