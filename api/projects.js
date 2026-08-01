import store from "./_store.js";

export default function handler(req, res) {
  const published = store.projects.filter(p => p.status === "published");
  return res.status(200).json({ success: true, data: published });
}
