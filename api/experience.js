import process from "node:process";

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
  return res.status(200).json({ success: true, data: sampleExperience });
}
