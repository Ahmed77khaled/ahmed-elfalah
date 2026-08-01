const store = require("./_store");

module.exports = function handler(req, res) {
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    const msg = {
      id: Date.now(),
      name: body.name || "Anonymous",
      email: body.email || "no-email@example.com",
      subject: body.subject || "No Subject",
      message: body.message || "",
      read: false,
      createdAt: new Date().toISOString()
    };
    store.messages.push(msg);
    return res.status(200).json({ success: true, data: { ok: true } });
  }
  return res.status(405).json({ error: "Method not allowed" });
};
