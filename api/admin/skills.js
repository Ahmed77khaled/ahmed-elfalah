const store = require("../_store");

module.exports = function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: store.skills });
  }
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    const newSkill = {
      id: Date.now(),
      name: body.name || "New Skill",
      icon: body.icon || "code",
      percentage: Number(body.percentage) || 80,
      category: body.category || "General",
      visible: body.visible !== undefined ? Boolean(body.visible) : true,
      displayOrder: body.displayOrder || store.skills.length + 1
    };
    store.skills.push(newSkill);
    return res.status(200).json({ success: true, data: newSkill });
  }
  return res.status(405).json({ error: "Method not allowed" });
};
