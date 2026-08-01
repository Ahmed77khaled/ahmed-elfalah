import store from "./_store.js";

export default function handler(req, res) {
  return res.status(200).json({ success: true, data: store.experience });
}
