import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
}

// Floating code particles in background
const CODE_SNIPPETS = [
  "const dev = () => {}",
  "git push origin main",
  "npm run build",
  "docker compose up",
  "sudo systemctl start",
  "SELECT * FROM skills",
  "import { Ahmed } from 'EG'",
  "ssh -i key server.io",
  "./configure --prefix=/usr",
  "ping -c 4 8.8.8.8",
  "python3 main.py",
  "curl -X POST /api",
];

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {CODE_SNIPPETS.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute text-[10px] font-mono whitespace-nowrap select-none"
          style={{
            color: i % 2 === 0 ? "hsl(var(--primary) / 0.18)" : "hsl(var(--accent) / 0.14)",
            left: `${(i * 8.3) % 95}%`,
            top: `${(i * 13.7) % 90}%`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [20, -30],
          }}
          transition={{
            duration: 3 + (i % 3),
            delay: i * 0.18,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeOut",
          }}
        >
          {snippet}
        </motion.div>
      ))}

      {/* Floating dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            background: i % 2 === 0 ? "hsl(var(--primary) / 0.3)" : "hsl(var(--accent) / 0.25)",
            left: `${(i * 5.3 + 3) % 96}%`,
            top: `${(i * 7.1 + 5) % 92}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 2 + (i % 4) * 0.5,
            delay: i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const start = Date.now();
    const total = 2200; // matches loading duration

    const tick = () => {
      const elapsed = Date.now() - start;
      const raw = elapsed / total;
      // ease-out curve
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
      setPercent(Math.round(eased * 100));
      if (raw < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 100000, background: "hsl(var(--background))" }}
        >
          {/* Ambient background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 40% 30% at 70% 40%, hsl(var(--accent) / 0.05) 0%, transparent 70%)",
            }}
          />

          {/* Floating code particles */}
          <Particles />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-0 z-10">
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative mb-10"
              style={{ width: 100, height: 100 }}
            >
              {/* Outer pulse ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: -16,
                  border: "1px solid hsl(var(--primary) / 0.15)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Spinning orbit */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: -8,
                  border: "1.5px solid transparent",
                  borderTopColor: "hsl(var(--primary) / 0.5)",
                  borderRightColor: "hsl(var(--primary) / 0.2)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              {/* Counter-spinning dashed ring */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  inset: -4,
                  border: "1px dashed hsl(var(--accent) / 0.35)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Core */}
              <div
                className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, hsl(var(--primary) / 0.3), hsl(var(--background)) 70%)",
                  boxShadow:
                    "0 0 0 1px hsl(var(--primary) / 0.25), 0 0 40px hsl(var(--primary) / 0.3), inset 0 0 30px hsl(var(--primary) / 0.1)",
                }}
              >
                {/* Scan line inside core */}
                <motion.div
                  className="absolute left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.8), transparent)",
                  }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.span
                  className="text-4xl font-black relative z-10"
                  style={{ fontFamily: "var(--app-font-sans)", color: "hsl(var(--primary))" }}
                  animate={{
                    textShadow: [
                      "0 0 8px hsl(190 100% 50% / 0.4)",
                      "0 0 24px hsl(190 100% 50% / 1)",
                      "0 0 8px hsl(190 100% 50% / 0.4)",
                    ],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  F
                </motion.span>
              </div>
            </motion.div>

            {/* Brand name — letter by letter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-end gap-0.5 mb-3"
            >
              {"Fel7o".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                  className="text-5xl font-black tracking-tight"
                  style={{
                    fontFamily: "var(--app-font-sans)",
                    color: char === "7" ? "hsl(var(--accent))" : "hsl(var(--foreground))",
                    textShadow:
                      char === "7"
                        ? "0 0 20px hsl(var(--accent) / 0.6)"
                        : "none",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="h-px w-8" style={{ background: "hsl(var(--primary) / 0.4)" }} />
              <span
                className="text-xs tracking-[0.28em] uppercase font-mono"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Loading Experience
              </span>
              <div className="h-px w-8" style={{ background: "hsl(var(--primary) / 0.4)" }} />
            </motion.div>

            {/* Progress track */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col items-center gap-3"
              style={{ width: 240 }}
            >
              {/* Track */}
              <div
                className="relative w-full rounded-full overflow-hidden"
                style={{ height: "2px", background: "hsl(var(--border))" }}
              >
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                    boxShadow: "0 0 8px hsl(var(--primary) / 0.8)",
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.4, duration: 1.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                {/* Shimmer */}
                <motion.div
                  className="absolute top-0 h-full w-8 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  }}
                  animate={{ left: ["-12%", "110%"] }}
                  transition={{ delay: 0.5, duration: 1.8, ease: "easeInOut" }}
                />
              </div>

              {/* Percentage */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs font-mono tabular-nums"
                style={{ color: "hsl(var(--primary) / 0.7)" }}
              >
                {percent}%
              </motion.span>
            </motion.div>
          </div>

          {/* Corner decorations */}
          {[
            { top: "24px", left: "24px", rotate: "0deg" },
            { top: "24px", right: "24px", rotate: "90deg" },
            { bottom: "24px", right: "24px", rotate: "180deg" },
            { bottom: "24px", left: "24px", rotate: "270deg" },
          ].map((style, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ ...style, width: 20, height: 20 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="M2 18 L2 2 L18 2"
                  stroke="hsl(var(--primary) / 0.3)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
