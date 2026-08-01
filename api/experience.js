import crypto from "node:crypto";

export default function handler(req, res) {
  try {
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

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    return res.end(JSON.stringify({ success: true, data: sampleExperience }));
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(JSON.stringify({ success: false, error: err ? err.message : "Server error" }));
  }
}
