import crypto from "node:crypto";

export default function handler(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      projects: 2,
      skills: 5,
      experience: 1,
      messages: 1,
      unreadMessages: 1
    }
  });
}
