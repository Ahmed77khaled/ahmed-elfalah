const sampleSkills = [
  { id: 1, name: "Python", icon: "code", percentage: 90, category: "Backend", visible: true, displayOrder: 1 },
  { id: 2, name: "DevOps & Docker", icon: "container", percentage: 85, category: "DevOps", visible: true, displayOrder: 2 },
  { id: 3, name: "Linux Administration", icon: "terminal", percentage: 88, category: "Infrastructure", visible: true, displayOrder: 3 },
  { id: 4, name: "React & TypeScript", icon: "layout", percentage: 82, category: "Frontend", visible: true, displayOrder: 4 },
  { id: 5, name: "Networking & Security", icon: "shield", percentage: 80, category: "Networking", visible: true, displayOrder: 5 }
];

export default function handler(req, res) {
  try {
    return res.status(200).json({ success: true, data: sampleSkills });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
