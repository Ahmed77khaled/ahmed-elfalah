import process from "node:process";

const sampleSkills = [
  { id: 1, name: "Python", icon: "code", percentage: 90, category: "Backend", visible: true, displayOrder: 1 },
  { id: 2, name: "DevOps & Docker", icon: "container", percentage: 85, category: "DevOps", visible: true, displayOrder: 2 },
  { id: 3, name: "Linux Administration", icon: "terminal", percentage: 88, category: "Infrastructure", visible: true, displayOrder: 3 },
  { id: 4, name: "React & TypeScript", icon: "layout", percentage: 82, category: "Frontend", visible: true, displayOrder: 4 },
  { id: 5, name: "Networking & Security", icon: "shield", percentage: 80, category: "Networking", visible: true, displayOrder: 5 }
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: sampleSkills });
  }
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    const newSkill = { id: Date.now(), name: body.name || "New Skill", visible: true, ...body };
    return res.status(200).json({ success: true, data: newSkill });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
