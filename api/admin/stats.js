import store from "../_store.js";

export default function handler(req, res) {
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
}
