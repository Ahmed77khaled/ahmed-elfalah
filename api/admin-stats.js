import crypto from "node:crypto";

export default function handler(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    return res.end(JSON.stringify({
      success: true,
      data: {
        projects: 2,
        skills: 5,
        experience: 1,
        messages: 1,
        unreadMessages: 1
      }
    }));
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(JSON.stringify({ success: false, error: err ? err.message : "Server error" }));
  }
}
