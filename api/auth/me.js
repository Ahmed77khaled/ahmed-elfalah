export default function handler(req, res) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      if (payload.exp * 1000 > Date.now()) {
        return res.status(200).json({ authenticated: true });
      }
    }
    return res.status(401).json({ error: "Token expired" });
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
