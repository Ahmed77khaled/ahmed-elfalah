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
  try {
    return res.status(200).json({ success: true, data: sampleMessages });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
