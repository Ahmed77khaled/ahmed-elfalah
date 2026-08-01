export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const password = body.password;
    const expectedPassword = process.env.ADMIN_PASSWORD || "ahmedkhaled18102005";

    if (password === expectedPassword) {
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
      const payload = Buffer.from(JSON.stringify({ role: "admin", exp: Math.floor(Date.now() / 1000) + (7 * 86400) })).toString("base64url");
      const token = `${header}.${payload}.admin_signature_verified`;
      return res.status(200).json({ token: token });
    }

    return res.status(401).json({ error: "Invalid password" });
  } catch (err) {
    return res.status(500).json({ error: err ? err.message : "Internal server error" });
  }
}
