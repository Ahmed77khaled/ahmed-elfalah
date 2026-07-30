import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";

const testimonials = [
  {
    id: 0,
    name: "Karim Benjelloun",
    role: "Founder & CEO",
    company: "Moroccan Fintech Startup",
    quote:
      "Youssef delivered our entire web platform in six weeks — clean code, on time, and under budget. He does not just build what you ask for; he anticipates what you need. The codebase he handed over is the best-organized project we have ever inherited.",
    avatar: "KB",
    accentColor: "primary",
  },
  {
    id: 1,
    name: "Sophie Laurent",
    role: "Product Manager",
    company: "Paris-Based SaaS",
    quote:
      "We hired Youssef to build an AI-powered internal tool for our team. Not only did he nail the technical implementation, but his understanding of the user experience side was exceptional. The team adopted it immediately — and it saved us 15 hours a week.",
    avatar: "SL",
    accentColor: "accent",
  },
  {
    id: 2,
    name: "Ahmed Al-Rashid",
    role: "Operations Director",
    company: "Dubai Logistics Company",
    quote:
      "The automation system Youssef built transformed how we handle repetitive workflows. What used to take two staff members full days now runs automatically with zero intervention. The ROI was positive within the first month.",
    avatar: "AR",
    accentColor: "primary",
  },
  {
    id: 3,
    name: "Amina Tahiri",
    role: "Digital Lead",
    company: "NGO, Casablanca",
    quote:
      "Youssef was a pleasure to work with from start to finish. His communication is excellent, his technical skill is top-tier, and he genuinely cares about delivering something great. We will absolutely work with him again on our next project.",
    avatar: "AT",
    accentColor: "accent",
  },
];

function TestimonialAvatar({ initials, color }: { initials: string; color: string }) {
  const isPrimary = color === "primary";
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
      style={{
        background: isPrimary
          ? "linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))"
          : "linear-gradient(135deg, hsl(var(--accent) / 0.3), hsl(var(--accent) / 0.1))",
        color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
        border: `2px solid ${isPrimary ? "hsl(var(--primary) / 0.3)" : "hsl(var(--accent) / 0.3)"}`,
      }}
    >
      {initials}
    </div>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(goNext, 5000);
    return () => clearInterval(intervalRef.current);
  }, [goNext]);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 5000);
  };

  const handleNext = () => { goNext(); resetTimer(); };
  const handlePrev = () => { goPrev(); resetTimer(); };

  const active = testimonials[activeIndex];

  return (
    <section id="testimonials" className="relative py-24 md:py-32" data-testid="testimonials-section">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--accent) / 0.02), transparent)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
            <span className="text-sm font-mono uppercase tracking-widest" style={{ color: "hsl(var(--primary))" }}>
              07. Testimonials
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            What Clients Say
          </h2>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{ minHeight: "320px" }}
          >
            {/* Large quote mark background */}
            <div
              className="absolute top-6 right-8 opacity-5"
              style={{ color: "hsl(var(--primary))" }}
            >
              <Quote size={120} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                data-testid={`testimonial-${active.id}`}
              >
                {/* Quote */}
                <div className="mb-8">
                  <Quote
                    size={24}
                    className="mb-4"
                    style={{ color: active.accentColor === "primary" ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
                  />
                  <p
                    className="text-lg md:text-xl leading-relaxed font-medium italic"
                    style={{ color: "hsl(var(--foreground) / 0.85)" }}
                  >
                    "{active.quote}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <TestimonialAvatar initials={active.avatar} color={active.accentColor} />
                  <div>
                    <div className="font-bold text-foreground">{active.name}</div>
                    <div className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {active.role} — {active.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              data-testid="testimonial-prev"
            >
              <ChevronLeft size={16} />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveIndex(i); resetTimer(); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "24px" : "8px",
                    height: "8px",
                    background: i === activeIndex ? "hsl(var(--primary))" : "hsl(var(--border))",
                  }}
                  data-testid={`testimonial-dot-${i}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              data-testid="testimonial-next"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
