import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Monitor, Zap, Brain, Palette, MessageSquare } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Full-stack web applications built with React, Next.js, and Node.js. Clean architecture, optimized performance, and maintainable codebases delivered on time.",
    tags: ["React", "Next.js", "Node.js", "TypeScript"],
    accent: "primary",
  },
  {
    icon: Monitor,
    title: "Desktop Applications",
    description:
      "Cross-platform desktop apps with Python and modern GUI frameworks. From CLI utilities to feature-rich GUI applications for power users.",
    tags: ["Python", "PyQt", "Electron", "Tauri"],
    accent: "accent",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description:
      "Automate repetitive tasks, integrate APIs, and build custom automation pipelines that save hours of manual work every week.",
    tags: ["Python", "Node.js", "APIs", "Cron"],
    accent: "primary",
  },
  {
    icon: Brain,
    title: "AI Integration",
    description:
      "Bring GPT and other AI capabilities into your existing products. Smart assistants, document analysis, code generation tools, and intelligent workflows.",
    tags: ["OpenAI", "LangChain", "Embeddings", "RAG"],
    accent: "accent",
  },
  {
    icon: Palette,
    title: "UI/UX Design & Implementation",
    description:
      "Design systems, component libraries, and pixel-perfect implementations. From wireframe to production-ready interface with accessibility built in.",
    tags: ["Figma", "Tailwind", "Framer", "Accessibility"],
    accent: "primary",
  },
  {
    icon: MessageSquare,
    title: "Technical Consulting",
    description:
      "Architecture reviews, technology selection, and technical roadmapping. I help teams make better engineering decisions before they become expensive problems.",
    tags: ["Architecture", "Code Review", "Best Practices"],
    accent: "accent",
  },
];

function ServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = service.icon;
  const isPrimary = service.accent === "primary";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
      style={{
        borderColor: "hsl(var(--border))",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = isPrimary
          ? "hsl(var(--primary) / 0.4)"
          : "hsl(var(--accent) / 0.4)";
        (e.currentTarget as HTMLElement).style.boxShadow = isPrimary
          ? "0 10px 40px hsl(var(--primary) / 0.1)"
          : "0 10px 40px hsl(var(--accent) / 0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
      data-testid={`service-card-${index}`}
      data-hover
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{
          background: isPrimary
            ? "hsl(var(--primary) / 0.1)"
            : "hsl(var(--accent) / 0.1)",
          color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
          border: `1px solid ${isPrimary ? "hsl(var(--primary) / 0.2)" : "hsl(var(--accent) / 0.2)"}`,
        }}
      >
        <Icon size={20} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{
              background: isPrimary ? "hsl(var(--primary) / 0.08)" : "hsl(var(--accent) / 0.08)",
              color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
              border: `1px solid ${isPrimary ? "hsl(var(--primary) / 0.15)" : "hsl(var(--accent) / 0.15)"}`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="services" className="relative py-24 md:py-32" data-testid="services-section">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--accent) / 0.02), transparent)" }}
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
              05. Services
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            What I Offer
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            End-to-end engineering services — from ideation to deployment. I bring both the technical depth
            and the product sensibility to make projects succeed.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
