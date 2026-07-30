import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            zIndex: 100000,
            background: "hsl(var(--background))",
          }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mb-8"
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px solid hsl(var(--primary) / 0.3)",
                width: "120px",
                height: "120px",
                top: "-20px",
                left: "-20px",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px dashed hsl(var(--accent) / 0.4)",
                width: "90px",
                height: "90px",
                top: "-5px",
                left: "-5px",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            {/* Center glow */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
                boxShadow: "0 0 40px hsl(var(--primary) / 0.4), inset 0 0 20px hsl(var(--primary) / 0.1)",
              }}
            >
              <motion.span
                className="text-3xl font-black"
                style={{ fontFamily: "var(--app-font-sans)", color: "hsl(var(--primary))" }}
                animate={{ textShadow: ["0 0 10px hsl(190 100% 50% / 0.5)", "0 0 30px hsl(190 100% 50% / 0.9)", "0 0 10px hsl(190 100% 50% / 0.5)"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                F
              </motion.span>
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-1 mb-4"
          >
            {"Fel7o".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="text-4xl font-black tracking-tight"
                style={{
                  fontFamily: "var(--app-font-sans)",
                  color: char === "7" ? "hsl(var(--accent))" : "hsl(var(--foreground))",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-sm tracking-widest uppercase"
            style={{ color: "hsl(var(--muted-foreground))", letterSpacing: "0.3em" }}
          >
            Loading Experience
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="mt-8 rounded-full overflow-hidden"
            style={{ width: "200px", height: "2px", background: "hsl(var(--border))" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.3, duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
