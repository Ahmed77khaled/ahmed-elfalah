import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Camera, Maximize2 } from "lucide-react";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";
import { api, type ExperienceRow } from "@/lib/admin-api";
import { ImageLightbox } from "@/components/ImageLightbox";

interface DisplayExperience {
  id: number;
  period: string;
  title: string;
  company: string;
  type: string;
  companyLogo?: string;
  icon: typeof Briefcase;
  description: string;
  galleryImages: string[];
  accent: string;
}

function parseArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      if (Array.isArray(p)) return p.map(String);
    } catch {
      return val ? [val] : [];
    }
  }
  return [];
}

function ExperienceItem({
  exp,
  index,
  hasNext,
  onOpenLightbox,
}: {
  exp: DisplayExperience;
  index: number;
  hasNext: boolean;
  onOpenLightbox: (images: string[], initialIdx: number, title: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = exp.icon;
  const isPrimary = exp.accent === "primary";
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative"
      data-testid={`experience-item-${index}`}
    >
      {/* Connector line to next item */}
      {hasNext && (
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 z-0"
          style={{
            top: "60px",
            height: "calc(100% + 48px)",
            width: "2px",
            background: `linear-gradient(to bottom, ${isPrimary ? "hsl(var(--primary) / 0.4)" : "hsl(var(--accent) / 0.4)"}, transparent)`,
          }}
        />
      )}

      <div className={`flex gap-6 md:gap-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
        {/* Content card */}
        <div className={`flex-1 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
          <div
            className="glass-card rounded-2xl p-6 hover:scale-[1.01] transition-all duration-300 shadow-lg relative group"
            style={{
              borderColor: isPrimary ? "hsl(var(--primary) / 0.25)" : "hsl(var(--accent) / 0.25)",
            }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                {exp.companyLogo ? (
                  <img
                    src={exp.companyLogo}
                    alt={exp.company}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border flex-shrink-0 shadow-sm"
                    style={{ borderColor: "hsl(var(--border))" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : null}
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary font-semibold">
                      {exp.type}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                  <p className="text-sm font-medium" style={{ color: isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))" }}>
                    {exp.company}
                  </p>
                </div>
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

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              {exp.description}
            </p>

            {/* Training Photos Gallery */}
            {exp.galleryImages.length > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "hsl(var(--border) / 0.5)" }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <Camera size={13} />
                    <span>Training Photos & Field Work ({exp.galleryImages.length})</span>
                  </div>
                  <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Click to view fullscreen</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {exp.galleryImages.map((img, imgIdx) => (
                    <button
                      key={imgIdx}
                      type="button"
                      onClick={() => onOpenLightbox(exp.galleryImages, imgIdx, `${exp.title} - ${exp.company}`)}
                      className="relative rounded-xl overflow-hidden group/thumb aspect-video border bg-black/40 cursor-pointer transition-all hover:scale-105 hover:border-primary"
                      style={{ borderColor: "hsl(var(--border))" }}
                    >
                      <img
                        src={img}
                        alt={`Photo ${imgIdx + 1}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 size={14} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center icon — desktop only */}
        <div className="hidden md:flex flex-shrink-0 flex-col items-center" style={{ width: "80px" }}>
          <div
            className="timeline-dot w-14 h-14 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 shadow-md"
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
  const [cmsExperience, setCmsExperience] = useState<ExperienceRow[]>([]);
  const [lightboxState, setLightboxState] = useState<{
    open: boolean;
    images: string[];
    index: number;
    title: string;
  }>({ open: false, images: [], index: 0, title: "" });

  useEffect(() => {
    const load = () => {
      void api.getPublicExperience().then(setCmsExperience).catch(() => setCmsExperience([]));
    };
    load();
    window.addEventListener("cms-data-changed", load);
    return () => window.removeEventListener("cms-data-changed", load);
  }, []);

  const displayExperience: DisplayExperience[] = cmsExperience.map((item) => ({
    id: item.id,
    period: `${item.startDate}${item.startDate && (item.endDate || item.currentPosition) ? " – " : ""}${item.currentPosition ? "Present" : item.endDate}`,
    title: item.position,
    company: item.company,
    type: item.type || "Training / Internship",
    companyLogo: item.companyLogo,
    icon: Briefcase,
    description: item.description,
    galleryImages: parseArray(item.galleryImages),
    accent: "primary",
  }));

  return (
    <section id="experience" className="relative py-24 md:py-32" data-testid="experience-section">
      {/* Lightbox Modal for Training Photos */}
      <ImageLightbox
        open={lightboxState.open}
        images={lightboxState.images}
        currentIndex={lightboxState.index}
        title={lightboxState.title}
        onClose={() => setLightboxState((s) => ({ ...s, open: false }))}
        onIndexChange={(idx) => setLightboxState((s) => ({ ...s, index: idx }))}
      />

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
              06. Experience & Training
            </span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Practical Experience & Training
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Hands-on internships, professional training programs, and practical field work.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="flex flex-col gap-12">
          {displayExperience.map((exp, i) => (
            <ExperienceItem
              key={exp.id}
              exp={exp}
              index={i}
              hasNext={i < displayExperience.length - 1}
              onOpenLightbox={(images, initialIdx, title) =>
                setLightboxState({ open: true, images, index: initialIdx, title })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
