import process from "node:process";

export default function handler(req, res) {
  return res.status(200).json({ status: "ok" });
}
