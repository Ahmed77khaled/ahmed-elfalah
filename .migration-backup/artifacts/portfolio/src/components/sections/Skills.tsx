import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Design & UX",
    icon: "UX",
    skills: [
      { name: "UI/UX Design", level: 78 },
      { name: "Figma", level: 74 },
      { name: "User Research", level: 70 },
      { name: "Prototyping", level: 72 },
    ],
  },
  {
    title: "Programming",
    icon: "DEV",
    skills: [
      { name: "Python", level: 68 },
      { name: "C++ Problem Solving", level: 65 },
      { name: "Java", level: 55 },
      { name: "Algorithms & DS", level: 63 },
    ],
  },
  {
    title: "AI & Automation",
    icon: "AI",
    skills: [
      { name: "AI Fundamentals", level: 72 },
      { name: "Prompt Engineering", level: 75 },
      { name: "AI Tools", level: 70 },
    ],
  },
  {
    title: "Networking",
    icon: "NET",
    skills: [
      { name: "CCNA", level: 82 },
      { name: "Network Protocols", level: 78 },
      { name: "Network Design", level: 74 },
    ],
  },
  {
    title: "Systems",
    icon: "SYS",
    skills: [
      { name: "Linux", level: 72 },
      { name: "System Administration", level: 60 },
      { name: "Server Management", level: 58 },
    ],
  },
  {
    title: "DevOps & Security",
    icon: "OPS",
    skills: [
      { name: "DevOps Practices", level: 55 },
      { name: "Docker", level: 50 },
      { name: "Git & GitHub", level: 80 },
      { name: "Huawei Security", level: 25 },
    ],
  },
];

function SkillBar({ skill, inView }: { skill: Skill; inView: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setWidth(skill.level), 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [inView, skill.level]);

  return (
    <div className="mb-4" data-testid={`skill-bar-${skill.name.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
        <span className="text-xs font-mono" style={{ color: "hsl(var(--primary))" }}>
          {inView ? `${skill.level}%` : "0%"}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "hsl(var(--border))" }}
      >
        <div
          className="h-full rounded-full skill-bar-fill"
          style={{
            width: `${width}%`,
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
            boxShadow: inView ? "0 0 8px hsl(var(--primary) / 0.5)" : "none",
          }}
        />
      </div>
    </div>
  );
}

function CategoryCard({ cat, delay }: { cat: SkillCategory; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="glass-card rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300"
      data-testid={`skill-category-${cat.title.toLowerCase()}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
          style={{
            background: "hsl(var(--primary) / 0.1)",
            color: "hsl(var(--primary))",
            border: "1px solid hsl(var(--primary) / 0.2)",
          }}
        >
          {cat.icon}
        </div>
        <h3 className="text-lg font-bold text-foreground">{cat.title}</h3>
      </div>
      <div>
        {cat.skills.map((skill) => (
          <SkillBar key={skill.name} skill={skill} inView={inView} />
        ))}
      </div>
    </motion.div>
  );
}

export function Skills() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="skills" className="relative py-24 md:py-32" data-testid="skills-section">
      {/* Subtle section bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.02), transparent)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
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
              02. Skills
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Technical Arsenal
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            A curated stack built through years of hands-on project work, continuous learning,
            and production deployments.
          </p>
        </motion.div>

        {/* Skill grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, i) => (
            <CategoryCard key={cat.title} cat={cat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
