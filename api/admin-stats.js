import store from "../lib/store.js";

export default function handler(req, res) {
  try {
    const unread = store.messages.filter(m => !m.read).length;
    return res.status(200).json({
      success: true,
      data: {
        projects: store.projects.length,
        skills: store.skills.length,
        experience: store.experience.length,
        messages: store.messages.length,
        unreadMessages: unread
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
