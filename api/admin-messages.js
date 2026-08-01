import crypto from "node:crypto";

const sampleMessages = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Collaboration Opportunity",
    message: "Hello Ahmed, I liked your DevOps and Web development portfolio!",
    read: false,
    createdAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: sampleMessages });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
