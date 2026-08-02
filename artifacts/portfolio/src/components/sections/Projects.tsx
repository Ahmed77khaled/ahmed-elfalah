import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ExternalLink, Github, X, Check, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
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
  coverImagePosition?: string;
  galleryImages?: string[];
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

function SafeImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-7xl font-black font-mono opacity-20" style={{ color: "hsl(var(--primary))" }}>
          {alt.slice(0, 3).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      className={className}
      style={style}
      onError={() => setError(true)}
    />
  );
}

function parseArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((x): x is string => typeof x === "string" && Boolean(x.trim()));
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string" && Boolean(x.trim()));
    } catch {}
  }
  return [];
}

function ImageLightbox({
  images,
  currentIndex,
  open,
  onClose,
  onIndexChange,
  title,
}: {
  images: string[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (idx: number) => void;
  title: string;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onIndexChange((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        onIndexChange((currentIndex + 1) % images.length);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, images.length, onIndexChange, onClose]);

  if (!open || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-[95vw] w-full h-[92vh] p-0 border-none bg-black/95 text-white flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl"
        data-testid="image-lightbox"
      >
        {/* Lightbox Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white/90">{title}</span>
            {images.length > 1 && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-mono font-bold">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
            aria-label="Close Fullscreen View"
          >
            <X size={22} />
          </button>
        </div>

        {/* Lightbox Main Image Display */}
        <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden select-none">
          <SafeImage
            src={currentImg}
            alt={`${title} - ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300"
          />

          {/* Nav Controls overlay */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white hover:scale-110 border border-white/20 backdrop-blur-md transition-all shadow-2xl z-30 cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={() => onIndexChange((currentIndex + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white hover:scale-110 border border-white/20 backdrop-blur-md transition-all shadow-2xl z-30 cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Lightbox Bottom Thumbnails Strip */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-white/10 bg-black/40 overflow-x-auto z-30 flex-shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onIndexChange(idx)}
                className={`relative rounded-md overflow-hidden border-2 transition-all flex-shrink-0 w-16 h-11 cursor-pointer ${
                  idx === currentIndex
                    ? "border-primary scale-110 shadow-lg"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <SafeImage src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProjectModal({ project, open, onClose }: { project: Project | null; open: boolean; onClose: () => void }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveImgIndex(0);
    setLightboxOpen(false);
  }, [project?.id]);

  if (!project) return null;

  const gallery = parseArray(project.galleryImages);
  const cover = project.coverImage?.trim();
  const allImages = Array.from(new Set([cover, ...gallery].filter((url): url is string => Boolean(url && url.trim()))));

  const nextImg = () => {
    if (allImages.length > 0) {
      setActiveImgIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImg = () => {
    if (allImages.length > 0) {
      setActiveImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const currentImg = allImages[activeImgIndex] || allImages[0];

  return (
    <>
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
            {/* Image Gallery Slider / Cover */}
            <div
              className="rounded-xl w-full overflow-hidden flex items-center justify-center relative group cursor-pointer bg-black/50"
              style={{
                height: "280px",
                background: project.gradient,
                border: "1px solid hsl(var(--border))",
              }}
              onClick={() => setLightboxOpen(true)}
            >
              {currentImg && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={currentImg}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter blur-xl scale-125 opacity-40"
                  />
                </div>
              )}
              <SafeImage
                src={currentImg || ""}
                alt={`${project.title} - ${activeImgIndex + 1}`}
                className="relative z-10 w-full h-full object-contain object-top transition-all duration-300 group-hover:scale-105"
              />

              {/* Fullscreen Expand / Zoom Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/75 text-white hover:bg-black/95 hover:scale-110 transition-all border border-white/20 backdrop-blur-md z-20 shadow-md cursor-pointer flex items-center gap-1.5 px-3"
                title="Expand Fullscreen"
              >
                <Maximize2 size={13} />
                <span className="text-xs font-semibold">Enlarge</span>
              </button>

              {/* Navigation Arrows if multiple images */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImg();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 text-white hover:bg-black/90 hover:scale-110 transition-all border border-white/20 backdrop-blur-md z-20 shadow-xl cursor-pointer"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImg();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 text-white hover:bg-black/90 hover:scale-110 transition-all border border-white/20 backdrop-blur-md z-20 shadow-xl cursor-pointer"
                    aria-label="Next Image"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Counter indicator */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold border border-white/20 backdrop-blur-md z-20 shadow-md">
                    {activeImgIndex + 1} / {allImages.length}
                  </div>

                  {/* Navigation Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md z-20 shadow-md">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImgIndex(idx);
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeImgIndex ? "w-6 bg-primary" : "w-2 bg-white/50 hover:bg-white"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2.5 mt-3 mb-6 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 w-20 h-14 cursor-pointer ${
                    idx === activeImgIndex ? "border-primary ring-2 ring-primary/40 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <SafeImage src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {allImages.length <= 1 && <div className="mb-6" />}
 
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
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" download={project.demoUrl.endsWith(".pkt") || undefined}>
                <ExternalLink size={14} className="mr-2" />
                {project.demoUrl.endsWith(".pkt") ? "Download Lab File" : "Live Demo"}
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

    <ImageLightbox
      images={allImages}
      currentIndex={activeImgIndex}
      open={lightboxOpen}
      onClose={() => setLightboxOpen(false)}
      onIndexChange={setActiveImgIndex}
      title={project.title}
    />
  </>
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
          className="relative h-48 flex items-center justify-center overflow-hidden bg-black/40"
          style={{ background: project.gradient }}
        >
          {project.coverImage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={project.coverImage}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter blur-md scale-125 opacity-35"
                style={{ objectPosition: project.coverImagePosition || "center center" }}
              />
            </div>
          )}
          <SafeImage
            src={project.coverImage || ""}
            alt={project.title}
            className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            style={{ objectPosition: project.coverImagePosition || "center center" }}
          />
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [cmsProjects, setCmsProjects] = useState<ProjectRow[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  useEffect(() => { const load=()=>{void api.getPublicProjects().then(setCmsProjects).catch(() => setCmsProjects([]));}; load(); window.addEventListener("cms-data-changed",load); return()=>window.removeEventListener("cms-data-changed",load); }, []);
  const displayProjects: Project[] = cmsProjects.map((project) => ({
    id: String(project.id), title: project.title, tagline: project.subtitle || project.shortDescription,
    description: project.longDescription || project.shortDescription,
    features: parseArray(project.features),
    tech: parseArray(project.techStack),
    category: project.category, gradient: "linear-gradient(135deg, hsl(190 100% 50% / 0.15), hsl(262 83% 57% / 0.1))",
    demoUrl: project.demoUrl || "#", githubUrl: project.githubUrl || "#",
    coverImage: project.coverImage,
    coverImagePosition: project.coverImagePosition || "center center",
    galleryImages: parseArray(project.galleryImages),
  }));
  const categories = ["All", "IoT & Embedded", "AI & Security", "Engineering", "Web Development"];
  const normalizeCategory = (category: string) => {
    const value = category.toLowerCase();
    if (value.includes("iot") || value.includes("embedded")) return "IoT & Embedded";
    if (value.includes("ai") || value.includes("security")) return "AI & Security";
    if (value.includes("engineering") || value.includes("network")) return "Engineering";
    return "Web Development";
  };
  const filteredProjects = activeCategory === "All" ? displayProjects : displayProjects.filter((project) => normalizeCategory(project.category) === activeCategory);

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

        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Project categories">
          {categories.map((category) => <button key={category} type="button" role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)} className="relative rounded-full px-4 py-2 text-sm font-semibold transition-colors" style={activeCategory === category ? { color: "hsl(var(--primary-foreground))", boxShadow: "0 0 24px hsl(var(--primary) / .35)" } : { color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>
            {activeCategory === category && <motion.span layoutId="project-filter" className="absolute inset-0 rounded-full -z-10 bg-primary" transition={{ type: "spring", bounce: .2, duration: .45 }} />}{category}
          </button>)}
        </div>
        {/* Project grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelectedProject(project)}
            />
          ))}
          </AnimatePresence>
        </motion.div>
        {filteredProjects.length === 0 && <p className="text-center text-muted-foreground mt-8">Projects in this category are coming soon.</p>}
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
