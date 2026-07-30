import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Code2, Award, BookOpen } from "lucide-react";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";

const experiences = [
  {
    period: "Jan 2024 – Present",
    title: "Senior Freelance Full Stack Developer",
    company: "Independent",
    type: "Freelance",
    icon: Briefcase,
    description:
      "Delivering full-stack web applications, automation tools, and AI integrations for clients across Morocco, France, and the Gulf region. Managing the entire project lifecycle from requirement analysis through deployment and ongoing maintenance.",
    achievements: [
      "Delivered 12+ production applications for SME clients",
      "Introduced AI-powered features that reduced manual work by 40%",
      "Maintained 100% on-time delivery rate over 18 months",
      "Built a repeatable project template that cut setup time by 60%",
    ],
    tech: ["React", "Node.js", "Python", "Docker", "PostgreSQL", "OpenAI"],
    accent: "primary",
  },
  {
    period: "Mar 2022 – Dec 2023",
    title: "Full Stack Developer",
    company: "Freelance — Early Stage",
    type: "Freelance",
    icon: Code2,
    description:
      "Developed web and desktop applications for local Moroccan businesses transitioning to digital workflows. Specialized in building internal tools, inventory systems, and e-commerce platforms tailored to the regional market.",
    achievements: [
      "Designed and deployed 8 full-stack projects",
      "Built a custom POS system used by 3 retail businesses",
      "Reduced client operational costs through targeted automation",
      "Established long-term maintenance contracts with 5 clients",
    ],
    tech: ["React", "Express", "MongoDB", "Python", "Linux", "NGINX"],
    accent: "accent",
  },
  {
    period: "2022",
    title: "Open Source Contributor",
    company: "GitHub Community",
    type: "Open Source",
    icon: Award,
    description:
      "Active contributor to developer tooling projects on GitHub. Submitted bug fixes, documentation improvements, and feature additions across multiple repositories. Engaged in code reviews and technical discussions with maintainers worldwide.",
    achievements: [
      "15+ merged pull requests across 6 repositories",
      "Authored comprehensive documentation for 2 projects",
      "Recognized as top contributor in a CLI tooling project",
    ],
    tech: ["Python", "JavaScript", "Shell", "Git", "Documentation"],
    accent: "primary",
  },
  {
    period: "2019 – 2022",
    title: "Self-Directed Learning & Foundations",
    company: "Independent Study",
    type: "Education",
    icon: BookOpen,
    description:
      "Three years of intensive self-directed learning, progressing from HTML/CSS fundamentals to full-stack proficiency. Completed over 2,000 hours of structured study through online courses, documentation, and project-based learning.",
    achievements: [
      "Mastered JavaScript, React, Node.js, and Python",
      "Completed 500+ coding challenges on LeetCode and HackerRank",
      "Built 20+ personal projects to reinforce concepts",
      "Studied CS fundamentals: algorithms, data structures, networking",
    ],
    tech: ["JavaScript", "Python", "HTML/CSS", "SQL", "Linux", "Git"],
    accent: "accent",
  },
];

function ExperienceItem({ exp, index }: { exp: (typeof experiences)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = exp.icon;
  const isPrimary = exp.accent === "primary";
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative"
      data-testid={`experience-item-${index}`}
    >
      {/* Connector line to next item */}
      {index < experiences.length - 1 && (
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2"
          style={{
            top: "60px",
            height: "calc(100% + 48px)",
            width: "1px",
            background: `linear-gradient(to bottom, ${isPrimary ? "hsl(var(--primary) / 0.4)" : "hsl(var(--accent) / 0.4)"}, transparent)`,
          }}
        />
      )}

      <div className={`flex gap-6 md:gap-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
        {/* Content card */}
        <div className={`flex-1 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
          <div
            className="glass-card rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300"
            style={{
              borderColor: isPrimary ? "hsl(var(--primary) / 0.2)" : "hsl(var(--accent) / 0.2)",
            }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {exp.type}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                <p className="text-sm font-medium" style={{ color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}>
                  {exp.company}
                </p>
              </div>
              <span
                className="text-xs font-mono px-3 py-1 rounded-full flex-shrink-0"
                style={{
                  background: isPrimary ? "hsl(var(--primary) / 0.1)" : "hsl(var(--accent) / 0.1)",
                  color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
                  border: `1px solid ${isPrimary ? "hsl(var(--primary) / 0.2)" : "hsl(var(--accent) / 0.2)"}`,
                }}
              >
                {exp.period}
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              {exp.description}
            </p>

            {/* Achievements */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}>
                Key Highlights
              </h4>
              <ul className="space-y-1">
                {exp.achievements.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <span
                      className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                      style={{ background: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech */}
            <div className="flex flex-wrap gap-1.5">
              {exp.tech.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Center icon — desktop only */}
        <div className="hidden md:flex flex-shrink-0 flex-col items-center" style={{ width: "80px" }}>
          <div
            className="timeline-dot w-14 h-14 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10"
            style={{
              background: "hsl(var(--background))",
              borderColor: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
              color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
            }}
          >
            <Icon size={22} />
          </div>
        </div>

        {/* Right spacer on desktop */}
        <div className="hidden md:block flex-1" />
      </div>
    </motion.div>
  );
}

export function Experience() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="experience" className="relative py-24 md:py-32" data-testid="experience-section">
      <div className="max-w-5xl mx-auto px-6">
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
              05. Experience
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Career Journey
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            From writing my first line of code to shipping production software for real clients — here is the path.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="flex flex-col gap-12">
          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.title} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
