export default function handler(req, res) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        projects: 2,
        skills: 5,
        experience: 1,
        messages: 1,
        unreadMessages: 1
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
