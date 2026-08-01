import store from "../lib/store.js";

export default function handler(req, res) {
  try {
    if (req.method === "GET") {
      return res.status(200).json({ success: true, data: store.messages });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
