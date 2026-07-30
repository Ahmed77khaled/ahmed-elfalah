import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";
import { SiFacebook, SiYoutube } from "react-icons/si";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/ahmed-el-falah-b771bb345", label: "LinkedIn" },
  { icon: SiFacebook, href: "https://web.facebook.com/ahmed.elfalah.754", label: "Facebook" },
  { icon: SiYoutube, href: "https://www.youtube.com/@Ahmed_59k", label: "YouTube" },
  { icon: Mail, href: "mailto:ahmed.khaled.elfalah@gmail.com", label: "Email" },
];

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t" data-testid="footer">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, hsl(var(--primary) / 0.03), transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-3xl font-black" style={{ fontFamily: "var(--app-font-sans)" }}>
                <span className="text-foreground">Fel</span>
                <span style={{ color: "hsl(var(--accent))" }}>7</span>
                <span className="text-foreground">o</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              Software engineer, AI builder, and creative technologist.
              Crafting beautiful software and resilient infrastructure from Port Said, Egypt to the world.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-testid={`footer-social-${label.toLowerCase()}`}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center transition-all duration-300"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary))";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "hsl(var(--primary))" }}>
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm text-left transition-colors hover:text-primary"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                  data-testid={`footer-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* CTA block */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "hsl(var(--primary))" }}>
              Let's Connect
            </h4>
            <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              Open to freelance projects, full-time opportunities, and interesting conversations.
            </p>
            <a
              href="mailto:ahmed.khaled.elfalah@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "hsl(var(--primary))" }}
              data-testid="footer-email-link"
            >
              <Mail size={14} />
              ahmed.khaled.elfalah@gmail.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            © 2024 Ahmed El-Falah. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            <span>Built with</span>
            <span style={{ color: "hsl(var(--primary))" }}>React</span>
            <span>+</span>
            <span style={{ color: "hsl(var(--accent))" }}>Framer Motion</span>
            <span>by</span>
            <span className="font-medium text-foreground">Fel7o</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
