import crypto from "node:crypto";

function signJwt(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
  body = body || {};
  const adminPassword = process.env.ADMIN_PASSWORD || "ahmedkhaled18102005";
  if (body.password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = signJwt({ role: "admin", exp: Math.floor(Date.now() / 1000) + 86400 * 7 }, process.env.SESSION_SECRET || "secret");
  return res.status(200).json({ token });
}
