import crypto from "node:crypto";

export default function handler(req, res) {
  try {
    const sampleSkills = [
      { id: 1, name: "Python", icon: "code", percentage: 90, category: "Backend", visible: true, displayOrder: 1 },
      { id: 2, name: "DevOps & Docker", icon: "container", percentage: 85, category: "DevOps", visible: true, displayOrder: 2 },
      { id: 3, name: "Linux Administration", icon: "terminal", percentage: 88, category: "Infrastructure", visible: true, displayOrder: 3 },
      { id: 4, name: "React & TypeScript", icon: "layout", percentage: 82, category: "Frontend", visible: true, displayOrder: 4 },
      { id: 5, name: "Networking & Security", icon: "shield", percentage: 80, category: "Networking", visible: true, displayOrder: 5 }
    ];

    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET") {
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, data: sampleSkills }));
    }
    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
      body = body || {};
      const newSkill = { id: Date.now(), name: body.name || "New Skill", visible: true, ...body };
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, data: newSkill }));
    }
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(JSON.stringify({ success: false, error: err ? err.message : "Server error" }));
  }
}
