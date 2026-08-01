import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Code2, Brain, Rocket, Heart } from "lucide-react";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";

const timelineItems = [
  {
    year: "2022",
    icon: Heart,
    title: "Design First",
    subtitle: "UI/UX Design & AI Fundamentals",
    description:
      "Started the journey with UI/UX design — learning the principles behind beautiful, usable digital products. Alongside, explored AI fundamentals and how artificial intelligence is reshaping every corner of the tech landscape.",
    color: "primary",
  },
  {
    year: "2023",
    icon: Code2,
    title: "Learning to Code",
    subtitle: "Python & Problem Solving with C++",
    description:
      "Dove deep into Python — from zero to level 3 — building automation scripts and data-driven tools. Studied Problem Solving with C++, sharpening algorithmic thinking and computer science fundamentals that make every future skill stronger.",
    color: "accent",
  },
  {
    year: "2024",
    icon: Brain,
    title: "Networking & Infrastructure",
    subtitle: "CCNA Certification",
    description:
      "Completed the CCNA networking course, gaining hands-on understanding of network protocols, routing, switching, and enterprise infrastructure design. Understanding how the internet truly works changed the way I think about every system I build.",
    color: "primary",
  },
  {
    year: "2024 — Now",
    icon: Rocket,
    title: "Systems & DevOps",
    subtitle: "System Administration + DevOps (In Progress)",
    description:
      "Currently mastering System Administration and DevOps practices — server management, Linux administration, CI/CD pipelines, and containerization. Every piece of the stack is becoming visible, from hardware to deployment.",
    color: "accent",
  },
  {
    year: "Next",
    icon: Brain,
    title: "Security Frontier",
    subtitle: "Huawei Security Certification — Starting Soon",
    description:
      "About to begin the Huawei Security certification program — taking the next major step in building a full-spectrum tech career spanning design, development, infrastructure, and cybersecurity. The goal: be the engineer who understands the entire system.",
    color: "primary",
  },
];

const values = [
  { icon: "01", title: "Clean Architecture", desc: "Code that is easy to read, maintain, and scale." },
  { icon: "02", title: "Continuous Learning", desc: "Technology evolves fast. I stay ahead of it." },
  { icon: "03", title: "Attention to Detail", desc: "Pixel-perfect UI and bug-free logic go hand in hand." },
  { icon: "04", title: "Ownership Mindset", desc: "I treat every project as if it were my own product." },
];

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timelineItems)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = item.icon;
  const isPrimary = item.color === "primary";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`relative flex gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row items-start`}
      data-testid={`timeline-item-${index}`}
    >
      {/* Content */}
      <div className={`flex-1 ${index % 2 !== 0 ? "md:text-right" : ""}`}>
        <div
          className="glass-card rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300"
          style={{
            borderColor: isPrimary ? "hsl(var(--primary) / 0.2)" : "hsl(var(--accent) / 0.2)",
          }}
        >
          <div className={`flex items-center gap-3 mb-3 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
            <Badge variant="outline" className="text-xs font-mono">
              {item.year}
            </Badge>
            <span className="text-xs font-medium" style={{ color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}>
              {item.subtitle}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            {item.description}
          </p>
        </div>
      </div>

      {/* Center icon — hidden on mobile, shown on md */}
      <div className="hidden md:flex flex-shrink-0 flex-col items-center" style={{ width: "60px" }}>
        <div
          className="timeline-dot w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0"
          style={{
            background: "hsl(var(--background))",
            borderColor: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
            color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      {/* Mobile icon — left side */}
      <div className="flex md:hidden flex-shrink-0 flex-col items-center">
        <div
          className="timeline-dot w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0"
          style={{
            background: "hsl(var(--background))",
            borderColor: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
            color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))",
          }}
        >
          <Icon size={16} />
        </div>
        {index < timelineItems.length - 1 && (
          <div
            className="flex-1 mt-2"
            style={{
              width: "1px",
              minHeight: "40px",
              background: `linear-gradient(to bottom, ${isPrimary ? "hsl(var(--primary) / 0.4)" : "hsl(var(--accent) / 0.4)"}, transparent)`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="about" className="relative py-24 md:py-32" data-testid="about-section">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
            <span className="text-sm font-mono uppercase tracking-widest" style={{ color: "hsl(var(--primary))" }}>
              01. About
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            The Story So Far
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin size={14} style={{ color: "hsl(var(--primary))" }} />
            <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              Based in Port Said, Egypt — Building for the world
            </span>
          </div>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
            I am Ahmed El-Falah, a self-driven technologist from Port Said, Egypt, with a passion for
            UI/UX design, Python development, networking, and DevOps. I am building a full-spectrum
            skill set — from crafting beautiful interfaces to managing resilient infrastructure.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-20">
          {/* Center line on desktop */}
          <div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--border)), transparent)" }}
          />

          <div className="flex flex-col gap-12">
            {timelineItems.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">What Drives Me</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center hover:scale-[1.03] transition-transform duration-300 group"
                data-hover
              >
                <div
                  className="text-3xl font-black mb-3 font-mono"
                  style={{ color: "hsl(var(--primary) / 0.3)" }}
                >
                  {v.icon}
                </div>
                <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {v.title}
                </h4>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
