const store = require("../_store");

module.exports = function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: store.experience });
  }
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    const newExp = {
      id: Date.now(),
      company: body.company || "Company",
      position: body.position || "Position",
      description: body.description || "",
      startDate: body.startDate || "",
      endDate: body.endDate || "",
      currentPosition: Boolean(body.currentPosition),
      companyLogo: body.companyLogo || "",
      displayOrder: body.displayOrder || store.experience.length + 1,
      createdAt: new Date().toISOString()
    };
    store.experience.push(newExp);
    return res.status(200).json({ success: true, data: newExp });
  }
  return res.status(405).json({ error: "Method not allowed" });
};
