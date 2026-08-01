import store from "./_store.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: store.messages });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
