import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, X, Check } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/fel7o-ds/components/ui/dialog";
import { api, type ProjectRow } from "@/lib/admin-api";

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  tech: string[];
  category: string;
  gradient: string;
  demoUrl: string;
  githubUrl: string;
  coverImage?: string;
}

/* Legacy static project content retained only as a non-executing design reference.
const projects: Project[] = [
  {
    id: "media-downloader",
    title: "Fel7o Media Downloader",
    tagline: "Download from 50+ platforms in any format",
    description:
      "A powerful media downloading tool that supports over 50 streaming and social platforms including YouTube, TikTok, Instagram, Twitter, and more. Features a clean CLI interface and a lightweight GUI, offering format selection, quality control, and batch downloading capabilities.",
    features: [
      "Support for 50+ video and audio platforms",
      "MP4, MP3, WebM, AAC and more format options",
      "Batch download with queue management",
      "Subtitle extraction and embedding",
      "Download speed optimization",
      "Cross-platform: Windows, Linux, macOS",
    ],
    tech: ["Python", "yt-dlp", "FFmpeg", "Tkinter", "Click", "Docker"],
    category: "Tools",
    gradient: "linear-gradient(135deg, hsl(190 100% 50% / 0.15), hsl(262 83% 57% / 0.1))",
    demoUrl: "#",
    githubUrl: "https://github.com",
  },
  {
    id: "ai-tools",
    title: "AI Tools Suite",
    tagline: "GPT-powered productivity applications",
    description:
      "A collection of AI-powered productivity tools designed for developers and knowledge workers. Includes a smart document summarizer, code reviewer, and writing assistant — all built on top of the OpenAI API with a modern React frontend.",
    features: [
      "Document summarization and key-point extraction",
      "AI-powered code review and suggestions",
      "Multi-model support (GPT-4, GPT-3.5-turbo)",
      "Prompt template library and management",
      "Conversation history with search",
      "Export to Markdown, PDF, and Notion",
    ],
    tech: ["React", "Next.js", "TypeScript", "OpenAI API", "Node.js", "PostgreSQL"],
    category: "AI",
    gradient: "linear-gradient(135deg, hsl(262 83% 57% / 0.2), hsl(190 100% 50% / 0.08))",
    demoUrl: "#",
    githubUrl: "https://github.com",
  },
  {
    id: "automation-dashboard",
    title: "Automation Dashboard",
    tagline: "Workflow automation for repetitive dev tasks",
    description:
      "A visual workflow automation platform for developers. Create, schedule, and monitor automated pipelines for repetitive tasks: file processing, API polling, data transformation, notifications, and more — all from a single intuitive dashboard.",
    features: [
      "Drag-and-drop workflow builder",
      "50+ pre-built action nodes",
      "Cron-based and event-triggered scheduling",
      "Real-time execution logs and alerts",
      "Webhook support for external integrations",
      "Version-controlled workflow definitions",
    ],
    tech: ["React", "Node.js", "Bull Queue", "Redis", "MongoDB", "Docker", "NGINX"],
    category: "DevTools",
    gradient: "linear-gradient(135deg, hsl(190 100% 50% / 0.12), hsl(262 83% 57% / 0.08))",
    demoUrl: "#",
    githubUrl: "https://github.com",
  },
  {
    id: "devops-dashboard",
    title: "DevOps Dashboard",
    tagline: "Server monitoring and deployment management",
    description:
      "A unified operations dashboard for monitoring server health, managing containerized deployments, and tracking infrastructure metrics in real time. Built for solo developers and small teams who want Kubernetes-level visibility without the complexity.",
    features: [
      "Real-time CPU, RAM, disk, and network monitoring",
      "Docker container management UI",
      "Deployment status tracking and rollback",
      "Log aggregation with full-text search",
      "Alert rules with Telegram and email notifications",
      "SSH terminal access from the browser",
    ],
    tech: ["React", "TypeScript", "Express", "Docker SDK", "Prometheus", "Grafana", "WebSockets"],
    category: "DevOps",
    gradient: "linear-gradient(135deg, hsl(262 83% 57% / 0.12), hsl(190 100% 50% / 0.12))",
    demoUrl: "#",
    githubUrl: "https://github.com",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio",
    tagline: "This site — a statement in code",
    description:
      "The very portfolio you are looking at, built as a showcase of what modern frontend engineering can achieve. Every effect, animation, and interaction is hand-crafted to demonstrate technical range while keeping performance as a first-class concern.",
    features: [
      "Framer Motion scroll animations throughout",
      "Custom WebGL-inspired canvas particles",
      "Loading screen with animated logo mark",
      "Custom cursor with magnetic hover effects",
      "3D card tilt on hover with CSS perspective",
      "Fully responsive across all screen sizes",
    ],
    tech: ["React", "TypeScript", "Framer Motion", "Tailwind CSS", "Vite", "Lenis"],
    category: "Web",
    gradient: "linear-gradient(135deg, hsl(190 100% 50% / 0.1), hsl(262 83% 57% / 0.15))",
    demoUrl: "/",
    githubUrl: "https://github.com",
  },
]; */

function use3DTilt() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return { handleMouseMove, handleMouseLeave };
}

function ProjectModal({ project, open, onClose }: { project: Project | null; open: boolean; onClose: () => void }) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-3xl w-full p-0 gap-0 flex flex-col"
        style={{ maxHeight: "88vh" }}
        data-testid={`project-modal-${project.id}`}
      >
        {/* Sticky header — never scrolls away */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">{project.category}</Badge>
            <DialogTitle className="text-xl font-black">{project.title}</DialogTitle>
          </div>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--primary))" }}>{project.tagline}</p>
        </DialogHeader>

        {/* Scrollable body — Lenis is prevented here */}
        <div
          className="overflow-y-auto flex-1 px-6 py-5"
          data-lenis-prevent
          style={{ overscrollBehavior: "contain" }}
        >
          {/* Hero image placeholder */}
          <div
            className="rounded-xl w-full overflow-hidden mb-6 flex items-center justify-center relative"
            style={{
              height: "200px",
              background: project.gradient,
              border: "1px solid hsl(var(--border))",
            }}
          >
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className="text-7xl font-black font-mono opacity-20"
                style={{ color: "hsl(var(--primary))" }}
              >
                {project.title.slice(0, 3).toUpperCase()}
              </div>
            )}
          </div>
 
          <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            {project.description}
          </p>
 
          {/* Features */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--primary))" }}>
              Key Features
            </h4>
            <ul className="space-y-2">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
 
          {/* Tech stack */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "hsl(var(--accent))" }}>
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
 
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="default"
              asChild
              data-testid={`project-demo-${project.id}`}
              style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}
            >
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} className="mr-2" />
                Live Demo
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              data-testid={`project-github-${project.id}`}
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github size={14} className="mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const { handleMouseMove, handleMouseLeave } = use3DTilt();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div
        className="project-card glass-card rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
          border: "1px solid hsl(var(--border))",
          willChange: "transform",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        data-testid={`project-card-${project.id}`}
        data-hover
      >
        {/* Card header — visual */}
        <div
          className="relative h-48 flex items-center justify-center overflow-hidden"
          style={{ background: project.gradient }}
        >
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className="text-7xl font-black font-mono opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              style={{ color: "hsl(var(--primary))" }}
            >
              {project.title.slice(0, 3).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: "radial-gradient(circle at center, hsl(var(--primary) / 0.08) 0%, transparent 70%)" }}
          />
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
              {project.category}
            </Badge>
          </div>
        </div>

        {/* Card body */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm mb-4" style={{ color: "hsl(var(--primary) / 0.7)" }}>
            {project.tagline}
          </p>
          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            {project.description}
          </p>

          {/* Tech stack preview */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 4).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
            {project.tech.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.tech.length - 4}
              </Badge>
            )}
          </div>

          {/* View details */}
          <div
            className="flex items-center gap-1 text-xs font-medium transition-all duration-300"
            style={{ color: "hsl(var(--primary))" }}
          >
            <span>View Details</span>
            <ExternalLink size={11} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cmsProjects, setCmsProjects] = useState<ProjectRow[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  useEffect(() => { const load=()=>{void api.getPublicProjects().then(setCmsProjects).catch(() => setCmsProjects([]));}; load(); window.addEventListener("cms-data-changed",load); return()=>window.removeEventListener("cms-data-changed",load); }, []);
  const displayProjects: Project[] = cmsProjects.map((project) => ({
    id: String(project.id), title: project.title, tagline: project.subtitle || project.shortDescription,
    description: project.longDescription || project.shortDescription, features: project.features || [],
    tech: project.techStack || [], category: project.category, gradient: "linear-gradient(135deg, hsl(190 100% 50% / 0.15), hsl(262 83% 57% / 0.1))",
    demoUrl: project.demoUrl || "#", githubUrl: project.githubUrl || "#", coverImage: project.coverImage,
  }));

  return (
    <section id="projects" className="relative py-24 md:py-32" data-testid="projects-section">
      <div className="max-w-7xl mx-auto px-6">
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
              03. Projects
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Featured Work
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            A selection of projects that represent my range — from low-level tooling to polished user interfaces.
          </p>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
