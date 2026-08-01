import store from "./store.js";

export default function handler(req, res) {
  try {
    const published = store.projects.filter(p => p.status === "published");
    return res.status(200).json({ success: true, data: published });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
