export default function handler(req, res) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return res.status(401).json({ authenticated: false });
  return res.status(200).json({ authenticated: true, role: "admin" });
}
