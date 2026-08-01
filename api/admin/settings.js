const sampleSettings = {
  siteTitle: "Ahmed El-Falah | Portfolio",
  adminEmail: "ahmed@example.com",
  maintenanceMode: "false"
};

export default function handler(req, res) {
  try {
    return res.status(200).json({ success: true, data: sampleSettings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
