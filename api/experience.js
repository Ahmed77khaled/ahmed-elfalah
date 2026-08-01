const store = require("./_store");

module.exports = function handler(req, res) {
  return res.status(200).json({ success: true, data: store.experience });
};
