const sampleExperience = [
  {
    id: 1,
    company: "Freelance",
    position: "Full Stack & DevOps Engineer",
    description: "Designing modern web applications and cloud infrastructure solutions for global clients.",
    startDate: "2023-01-01",
    endDate: "Present",
    currentPosition: true,
    companyLogo: "",
    displayOrder: 1,
    createdAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: sampleExperience });
  }
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    const newExp = { id: Date.now(), company: body.company || "Company", ...body };
    return res.status(200).json({ success: true, data: newExp });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
