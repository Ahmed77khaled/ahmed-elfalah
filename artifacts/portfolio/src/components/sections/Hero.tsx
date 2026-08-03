import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Mail, ChevronDown, Github, Linkedin } from "lucide-react";
import { SiFacebook, SiYoutube } from "react-icons/si";
import { Button } from "@workspace/fel7o-ds/components/ui/button";

const TYPING_TEXTS = [
  "Aspiring DevOps Engineer",
  "Cybersecurity Engineer",
  "Infrastructure & Automation",
  "Future DevSecOps Engineer",
];

function TypingEffect() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const currentText = TYPING_TEXTS[textIndex];
    const speed = isDeleting ? 50 : 80;

    timeoutRef.current = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(currentText.slice(0, displayed.length + 1));
        if (displayed.length + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayed(displayed.slice(0, -1));
        if (displayed.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, isDeleting, textIndex]);

  return (
    <span className="inline-flex items-center">
      <span className="gradient-text font-bold">{displayed}</span>
      <span className="typing-cursor ml-0.5 w-0.5 h-8 md:h-10 inline-block" style={{ background: "hsl(var(--primary))" }} />
    </span>
  );
}

const socialLinks = [
  { icon: Github, href: "https://github.com/Ahmed77khaled", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ahmed-el-falah-b771bb345", label: "LinkedIn" },
  { icon: SiFacebook, href: "https://web.facebook.com/ahmed.elfalah.754", label: "Facebook" },
  { icon: SiYoutube, href: "https://www.youtube.com/@Ahmed_59k", label: "YouTube" },
  { icon: Mail, href: "mailto:ahmed.khaled.elfalah@gmail.com", label: "Email" },
];

const PORTRAIT_SRC: string | null = "/profile.jpg";
// ─────────────────────────────────────────────────────────────────────────────

// Portrait orb component
function PortraitOrb() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
      {/* Outer glow rings */}
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
          animation: "orb-rotate 8s linear infinite",
        }}
      />
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: "110%",
          height: "110%",
          borderColor: "hsl(var(--primary) / 0.2)",
          top: "-5%",
          left: "-5%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute rounded-full border border-dashed"
        style={{
          width: "125%",
          height: "125%",
          borderColor: "hsl(var(--accent) / 0.3)",
          top: "-12.5%",
          left: "-12.5%",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Main orb */}
      <div
        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
        style={{
          background: PORTRAIT_SRC
            ? "none"
            : "radial-gradient(ellipse at 30% 30%, hsl(var(--primary) / 0.25) 0%, hsl(var(--accent) / 0.15) 40%, hsl(var(--background)) 70%)",
          boxShadow: "0 0 60px hsl(var(--primary) / 0.2), 0 0 120px hsl(var(--primary) / 0.1), inset 0 0 40px hsl(var(--primary) / 0.1)",
          border: "1px solid hsl(var(--primary) / 0.3)",
        }}
      >
        {PORTRAIT_SRC ? (
          /* ── Real photo ── */
          <>
            <img
              src={PORTRAIT_SRC}
              alt="Ahmed El-Falah"
              className="w-full h-full object-cover object-top"
              style={{ filter: "brightness(0.92) contrast(1.05)" }}
            />
            {/* Subtle colour overlay to blend with theme */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, transparent 55%, hsl(var(--background) / 0.55) 100%)",
                pointerEvents: "none",
              }}
            />
            {/* Cyan rim light */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "inset 0 0 40px hsl(var(--primary) / 0.15)",
                pointerEvents: "none",
              }}
            />
          </>
        ) : (
          /* ── Placeholder silhouette (shown until photo is added) ── */
          <>
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
              <defs>
                <radialGradient id="orbGrad1" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="hsl(190, 100%, 50%)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="orbGrad2" cx="60%" cy="70%">
                  <stop offset="0%" stopColor="hsl(262, 83%, 57%)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="100" fill="url(#orbGrad1)" />
              <circle cx="100" cy="100" r="100" fill="url(#orbGrad2)" />
              <g opacity="0.4" fill="hsl(190, 100%, 50%)">
                <circle cx="100" cy="68" r="22" />
                <ellipse cx="100" cy="120" rx="28" ry="32" />
                <ellipse cx="70" cy="105" rx="12" ry="8" opacity="0.5" />
                <ellipse cx="130" cy="105" rx="12" ry="8" opacity="0.5" />
              </g>
              <text x="20" y="50" fill="hsl(190, 100%, 50%)" opacity="0.3" fontSize="10" fontFamily="monospace">{"{ }"}</text>
              <text x="155" y="160" fill="hsl(262, 83%, 57%)" opacity="0.3" fontSize="10" fontFamily="monospace">{"</>"}</text>
              <text x="30" y="170" fill="hsl(190, 100%, 50%)" opacity="0.2" fontSize="8" fontFamily="monospace">{"AI"}</text>
            </svg>

            {/* Scan line */}
            <div
              className="absolute left-0 right-0 h-px opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
                animation: "scan 3s linear infinite",
              }}
            />
          </>
        )}
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -bottom-2 -right-2 glass-card rounded-xl px-3 py-2 text-xs font-semibold"
        style={{ borderColor: "hsl(var(--primary) / 0.3)", boxShadow: "0 0 20px hsl(var(--primary) / 0.2)" }}
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ color: "hsl(var(--primary))" }}>Available</span>
        <span className="ml-1 text-muted-foreground">for hire</span>
      </motion.div>

      <motion.div
        className="absolute -top-2 -left-2 glass-card rounded-xl px-3 py-2 text-xs font-mono"
        style={{ borderColor: "hsl(var(--accent) / 0.3)", boxShadow: "0 0 20px hsl(var(--accent) / 0.2)" }}
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ color: "hsl(var(--accent))" }}>{"<"}</span>
        <span className="text-foreground">Ahmed</span>
        <span style={{ color: "hsl(var(--accent))" }}>{" />"}</span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const handleScroll = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
      data-testid="hero-section"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 py-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Pre-heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2 justify-center lg:justify-start mb-6"
            >
              <div className="h-px w-8" style={{ background: "hsl(var(--primary))" }} />
              <span className="text-sm font-mono tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                Port Said, Egypt — Developer
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 tracking-tight" style={{ fontFamily: "var(--app-font-sans)" }}>
                {"Hi, I'm ".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.04 }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="gradient-text"
                >
                  Ahmed.
                </motion.span>
              </h1>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-3xl md:text-5xl font-black leading-tight mb-6"
              >
                I Build{" "}
                <span style={{ color: "hsl(var(--foreground))" }}>Reliable</span>{" "}
                <span className="gradient-text">Systems.</span>
              </motion.h2>
            </motion.div>

            {/* Typing effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-xl md:text-2xl mb-8 min-h-[2.5rem] font-medium"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <TypingEffect />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-base md:text-lg mb-10 max-w-xl leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Computer Engineering Student focused on DevOps, cybersecurity, infrastructure, and automation.
              I build practical systems and technical projects that make services more reliable, observable, and secure.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
            >
              <Button
                variant="default"
                size="lg"
                onClick={() => handleScroll("#projects")}
                data-testid="hero-view-projects"
                style={{
                  boxShadow: "0 0 30px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.15)",
                  fontWeight: 700,
                }}
              >
                View Projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                data-testid="hero-download-resume"
                style={{ borderColor: "hsl(var(--primary) / 0.4)" }}
              >
                <a href="/Ahmed_Khaled_Elfalah_FINAL_CV.pdf" target="_blank" rel="noopener noreferrer" download>
                  <Download size={16} className="mr-2" />
                  Download CV (PDF)
                </a>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleScroll("#contact")}
                data-testid="hero-contact-me"
              >
                <Mail size={16} className="mr-2" />
                Contact Me
              </Button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-testid={`social-${label.toLowerCase()}`}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    color: "hsl(var(--muted-foreground))",
                    borderColor: "hsl(var(--border))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary))";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--primary) / 0.5)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px hsl(var(--primary) / 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Portrait orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <PortraitOrb />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={16} style={{ color: "hsl(var(--primary))" }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
