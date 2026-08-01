import store from "../lib/store.js";

export default function handler(req, res) {
  try {
    return res.status(200).json({ success: true, data: store.experience });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
