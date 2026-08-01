import store from "../_store.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: store.settings });
  }
  if (req.method === "PUT") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    Object.assign(store.settings, body);
    return res.status(200).json({ success: true, data: { ok: true } });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
