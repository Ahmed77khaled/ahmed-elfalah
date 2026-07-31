export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { password } = body;
    const expectedPassword = process.env.ADMIN_PASSWORD || "ahmedkhaled18102005";

    if (password === expectedPassword) {
      // Return a valid JWT-like token structure
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
      const payload = Buffer.from(JSON.stringify({ role: "admin", exp: Math.floor(Date.now() / 1000) + (7 * 86400) })).toString("base64url");
      const dummyToken = `${header}.${payload}.admin_signature_verified`;
      return res.status(200).json({ token: dummyToken });
    }

    return res.status(401).json({ error: "Invalid password" });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal error" });
  }
}
