import { useEffect } from "react";

export function VisitorTracker() {
  useEffect(() => {
    // Only track once per browser session to prevent spam on refresh
    if (sessionStorage.getItem("visitor_logged")) return;

    const trackVisitor = async () => {
      try {
        sessionStorage.setItem("visitor_logged", "true");

        // 1. Get Geo Location
        let country = "Unknown";
        let city = "";
        try {
          const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            country = data.country_name || country;
            city = data.city ? `, ${data.city}` : "";
          }
        } catch {
          try {
            const res2 = await fetch("https://ip-api.com/json/", { cache: "no-store" });
            if (res2.ok) {
              const data2 = await res2.json();
              country = data2.country || country;
              city = data2.city ? `, ${data2.city}` : "";
            }
          } catch {
            // Ignore geo errors
          }
        }

        // 2. Detect Device & Browser
        const ua = navigator.userAgent;
        let device = "Desktop (PC)";
        if (/mobile/i.test(ua)) device = "Mobile (Phone)";
        else if (/ipad|tablet/i.test(ua)) device = "Tablet";

        let browser = "Browser";
        if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edg")) browser = "Edge";

        // 3. Detect Source / Referrer
        let referrer = document.referrer;
        if (!referrer) referrer = "Direct Visit / Bookmark";
        else if (referrer.includes("linkedin")) referrer = "LinkedIn 🔗";
        else if (referrer.includes("whatsapp")) referrer = "WhatsApp 💬";
        else if (referrer.includes("facebook")) referrer = "Facebook 📱";
        else if (referrer.includes("google")) referrer = "Google Search 🔍";

        // 4. Send Alert to Visitors Bot
        const botToken = "8352050648:AAGLq-QTCZ-bxUNCDPVICq15n9XK6a71NpI";
        const chatId = "8275645729";
        const escapeHtml = (str: string) =>
          str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const text = `👀 <b>New Visitor on Portfolio!</b>\n\n🌍 <b>Location:</b> ${escapeHtml(country)}${escapeHtml(city)}\n📱 <b>Device:</b> ${escapeHtml(device)} (${escapeHtml(browser)})\n🔗 <b>Source:</b> ${escapeHtml(referrer)}\n⏰ <b>Time:</b> ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "HTML",
          }),
        });
      } catch {
        // Ignore tracking errors
      }
    };

    trackVisitor();
  }, []);

  return null;
}
