import crypto from "node:crypto";

const sampleSettings = {
  siteTitle: "Ahmed El-Falah | Portfolio",
  adminEmail: "ahmed@example.com",
  maintenanceMode: "false"
};

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: sampleSettings });
  }
  if (req.method === "PUT") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    Object.assign(sampleSettings, body || {});
    return res.status(200).json({ success: true, data: { ok: true } });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
