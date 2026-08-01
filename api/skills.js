const store = require("./_store");

module.exports = function handler(req, res) {
  const visible = store.skills.filter(s => s.visible);
  return res.status(200).json({ success: true, data: visible });
};
