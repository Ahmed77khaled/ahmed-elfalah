import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  {
    value: 50,
    suffix: "+",
    label: "Projects Shipped",
    description: "Production-grade applications across web, desktop, and automation",
  },
  {
    value: 30,
    suffix: "+",
    label: "Happy Clients",
    description: "Satisfied clients from Morocco, Europe, and the Gulf region",
  },
  {
    value: 3,
    suffix: "+",
    label: "Years of Craft",
    description: "Continuous learning and relentless improvement since 2019",
  },
  {
    value: 500,
    suffix: "K+",
    label: "Lines of Code",
    description: "Written, reviewed, and refactored across dozens of codebases",
  },
  {
    value: 10,
    suffix: "K+",
    label: "Downloads",
    description: "Tools and utilities downloaded by developers worldwide",
  },
];

function AnimatedCounter({ stat, inView }: { stat: Stat; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), stat.value);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, stat.value]);

  return (
    <span className="stat-number text-5xl md:text-6xl font-black tracking-tighter" style={{ color: "hsl(var(--primary))" }}>
      {stat.prefix && <span>{stat.prefix}</span>}
      {inView ? count : 0}
      <span>{stat.suffix}</span>
    </span>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-8 text-center group hover:scale-[1.03] transition-transform duration-300 relative overflow-hidden"
      data-testid={`stat-card-${index}`}
      data-hover
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: "radial-gradient(circle at center, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-2">
          <AnimatedCounter stat={stat} inView={inView} />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{stat.label}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
          {stat.description}
        </p>
      </div>
    </motion.div>
  );
}

export function Stats() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="stats" className="relative py-24 md:py-32" data-testid="stats-section">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.03), transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
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
              06. By the Numbers
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Impact in Metrics
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Numbers that reflect real work, real clients, and real impact.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
