import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Code2, Brain, Rocket, ShieldCheck } from "lucide-react";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";

const timelineItems = [
  { year: "2022", icon: Brain, title: "Engineering Foundations", subtitle: "Computer Engineering & Technical Problem Solving", description: "Built a foundation in computer engineering, technical problem solving, and systems thinking - the base for working across infrastructure, networking, and automation.", color: "primary" },
  { year: "2023", icon: Code2, title: "Automation with Code", subtitle: "Python, Bash Concepts & C++ Problem Solving", description: "Developed programming fundamentals with Python and C++, using code for automation, data handling, and disciplined technical problem solving.", color: "accent" },
  { year: "2024", icon: Brain, title: "Networking & Infrastructure", subtitle: "CCNA Training", description: "Completed hands-on networking training in routing, switching, VLANs, OSPF, and enterprise infrastructure design. Reliability and troubleshooting became central to my engineering approach.", color: "primary" },
  { year: "2024 - Now", icon: Rocket, title: "Systems & DevOps", subtitle: "System Administration + DevOps", description: "Developing operational skills in Linux administration, containerization, CI/CD, monitoring, and automation - connecting application delivery to dependable infrastructure.", color: "accent" },
  { year: "Next", icon: ShieldCheck, title: "DevSecOps Direction", subtitle: "Cybersecurity, SOC Concepts & Secure Operations", description: "Expanding into cybersecurity, SOC concepts, and secure operations with a long-term focus on DevSecOps: building and operating systems with security integrated from the start.", color: "primary" },
];

const values = [
  { icon: "01", title: "Reliable Systems", desc: "Infrastructure and automation built for dependable operation." },
  { icon: "02", title: "Continuous Learning", desc: "Building practical skills through labs, projects, and technical programs." },
  { icon: "03", title: "Security Mindset", desc: "Treating secure operations as part of every engineering decision." },
  { icon: "04", title: "Ownership Mindset", desc: "Taking responsibility from technical problem to practical outcome." },
];

function TimelineItem({ item, index }: { item: (typeof timelineItems)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = item.icon;
  const isPrimary = item.color === "primary";

  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className={`relative flex gap-6 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row items-start`} data-testid={`timeline-item-${index}`}>
      <div className={`flex-1 ${index % 2 !== 0 ? "md:text-right" : ""}`}>
        <div className="glass-card rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300" style={{ borderColor: isPrimary ? "hsl(var(--primary) / 0.2)" : "hsl(var(--accent) / 0.2)" }}>
          <div className={`flex items-center gap-3 mb-3 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
            <Badge variant="outline" className="text-xs font-mono">{item.year}</Badge>
            <span className="text-xs font-medium" style={{ color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}>{item.subtitle}</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.description}</p>
        </div>
      </div>
      <div className="hidden md:flex flex-shrink-0 flex-col items-center" style={{ width: "60px" }}>
        <div className="timeline-dot w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0" style={{ background: "hsl(var(--background))", borderColor: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))", color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}><Icon size={20} /></div>
      </div>
      <div className="flex md:hidden flex-shrink-0 flex-col items-center">
        <div className="timeline-dot w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0" style={{ background: "hsl(var(--background))", borderColor: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))", color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}><Icon size={16} /></div>
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
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4"><div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} /><span className="text-sm font-mono uppercase tracking-widest" style={{ color: "hsl(var(--primary))" }}>01. About</span><div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} /></div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">The Engineering Path</h2>
          <div className="flex items-center justify-center gap-2 mb-6"><MapPin size={14} style={{ color: "hsl(var(--primary))" }} /><span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Based in Port Said, Egypt - Building for the world</span></div>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>I am Ahmed El-Falah, a Computer Engineering student from Port Said, Egypt, focused on DevOps, cybersecurity, networking, and automation. I am building the practical skills to design, operate, and secure reliable infrastructure.</p>
        </motion.div>
        <div className="relative mb-20"><div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-px" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--border)), transparent)" }} /><div className="flex flex-col gap-12">{timelineItems.map((item, i) => <TimelineItem key={item.year} item={item} index={i} />)}</div></div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">What Drives Me</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{values.map((value, i) => <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="glass-card rounded-2xl p-6 text-center hover:scale-[1.03] transition-transform duration-300 group" data-hover><div className="text-3xl font-black mb-3 font-mono" style={{ color: "hsl(var(--primary) / 0.3)" }}>{value.icon}</div><h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{value.title}</h4><p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{value.desc}</p></motion.div>)}</div>
        </motion.div>
      </div>
    </section>
  );
}
