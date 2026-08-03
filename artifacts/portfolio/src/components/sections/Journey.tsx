import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Star, BookOpen, Trophy, Users, Zap, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";

type JourneyEntry = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  eventDate: string;         // "YYYY-MM-DD"
  category: "education" | "achievement" | "personal" | "project";
  tags: string[];
  imageUrl: string;
  imageCaption: string;
  galleryImages?: string[];
  highlight: boolean;
  displayOrder: number;
};

const CATEGORIES = [
  { key: "all",         label: "All",          icon: Zap },
  { key: "education",   label: "Education",    icon: BookOpen },
  { key: "achievement", label: "Achievement",  icon: Trophy },
  { key: "personal",    label: "Personal",     icon: Users },
  { key: "project",     label: "Project",      icon: Star },
] as const;

const CATEGORY_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
  education:   { dot: "bg-primary",          badge: "bg-primary/15 text-primary border-primary/30",         label: "Education"    },
  achievement: { dot: "bg-amber-400",        badge: "bg-amber-400/15 text-amber-400 border-amber-400/30",   label: "Achievement"  },
  personal:    { dot: "bg-emerald-400",      badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30", label: "Personal" },
  project:     { dot: "bg-violet-400",       badge: "bg-violet-400/15 text-violet-400 border-violet-400/30", label: "Project"    },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getYear(dateStr: string) {
  return dateStr.slice(0, 4);
}

function JourneyCardImage({
  entry,
  onOpenLightbox,
}: {
  entry: JourneyEntry;
  onOpenLightbox: (images: string[], index: number, title: string) => void;
}) {
  const images =
    entry.galleryImages && entry.galleryImages.length > 0
      ? entry.galleryImages
      : entry.imageUrl
      ? [entry.imageUrl]
      : [];

  const [currentIdx, setCurrentIdx] = useState(0);

  if (images.length === 0) return null;

  const currentImg = images[currentIdx] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer bg-black/40 group/img"
      onClick={() => onOpenLightbox(images, currentIdx, entry.imageCaption || entry.title)}
    >
      <img
        src={currentImg}
        alt={`${entry.title} - Photo ${currentIdx + 1}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
      />

      {/* Overlay caption */}
      {entry.imageCaption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 pointer-events-none">
          <p className="text-white text-xs font-medium truncate">{entry.imageCaption}</p>
        </div>
      )}

      {/* Image Count Badge */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
          <Images size={12} className="text-primary" />
          <span>{currentIdx + 1} / {images.length}</span>
        </div>
      )}

      {/* Inline Nav Arrows for Multi-image */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-primary transition-all border border-white/20 opacity-0 group-hover/img:opacity-100 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-primary transition-all border border-white/20 opacity-0 group-hover/img:opacity-100 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Hover View Hint */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
          {images.length > 1 ? `View All ${images.length} Photos` : "View Full Photo"}
        </span>
      </div>
    </div>
  );
}

export function Journey() {
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const [lightboxState, setLightboxState] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/journey")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setEntries(json.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "all"
      ? entries
      : entries.filter((e) => e.category === activeFilter);

  // Group entries by year
  const byYear: { year: string; items: JourneyEntry[] }[] = [];
  for (const entry of filtered) {
    const yr = getYear(entry.eventDate);
    const group = byYear.find((g) => g.year === yr);
    if (group) group.items.push(entry);
    else byYear.push({ year: yr, items: [entry] });
  }

  return (
    <section id="journey" className="relative py-24 md:py-32" data-testid="journey-section">
      {/* Multi-Image Lightbox */}
      {lightboxState && (
        <ImageLightbox
          open
          images={lightboxState.images}
          currentIndex={lightboxState.index}
          title={lightboxState.title}
          onClose={() => setLightboxState(null)}
          onIndexChange={(idx) => setLightboxState((prev) => prev ? { ...prev, index: idx } : null)}
        />
      )}

      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
            <span className="text-sm font-mono uppercase tracking-widest text-primary">02. Journey</span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground">My Learning Journey</h2>
          <p className="text-lg mt-4 text-muted-foreground max-w-xl mx-auto">
            Every step, milestone, and moment that shaped who I am as an engineer.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeFilter === key
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">No journey entries yet.</p>
          </div>
        )}

        {/* Timeline */}
        {!loading && byYear.length > 0 && (
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: "hsl(var(--border))", transform: "translateX(-50%)" }}
            />

            {byYear.map(({ year, items }) => (
              <div key={year} className="mb-2">
                {/* Year Label */}
                <div className="relative flex items-center mb-8">
                  <div
                    className="absolute left-0 md:left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-primary/30 z-10 font-mono"
                  >
                    {year}
                  </div>
                </div>

                {/* Entries in this year */}
                {items.map((entry, idx) => {
                  const style = CATEGORY_STYLES[entry.category] ?? CATEGORY_STYLES.education;
                  const isLeft = idx % 2 === 0;
                  const isExpanded = expanded === entry.id;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className={`relative flex items-start mb-8 gap-6 ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      } flex-row`}
                    >
                      {/* Dot */}
                      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex-shrink-0 z-10 mt-1">
                        <div
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform ${
                            entry.highlight
                              ? "border-amber-400 bg-amber-400/20 scale-110"
                              : `border-border bg-background`
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${style.dot}`} />
                        </div>
                      </div>

                      {/* Spacer for center line on desktop */}
                      <div className="hidden md:block md:w-1/2 flex-shrink-0" />

                      {/* Card */}
                      <div
                        className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden group w-full md:w-[calc(50%-2.5rem)] ml-12 md:ml-0 ${
                          entry.highlight
                            ? "border-amber-400/40 shadow-lg shadow-amber-400/10"
                            : "border-border hover:border-primary/40 hover:shadow-lg"
                        }`}
                      >
                        {/* Card Image Gallery */}
                        <JourneyCardImage
                          entry={entry}
                          onOpenLightbox={(imgs, i, title) => setLightboxState({ images: imgs, index: i, title })}
                        />

                        {/* Card Content */}
                        <div className="p-5">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                {entry.highlight && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                                    <Star size={10} fill="currentColor" /> Milestone
                                  </span>
                                )}
                                <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${style.badge}`}>
                                  {style.label}
                                </span>
                              </div>
                              <h3 className="font-bold text-base text-foreground leading-snug">
                                {entry.title}
                              </h3>
                              {entry.subtitle && (
                                <p className="text-xs text-muted-foreground mt-0.5">{entry.subtitle}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
                              <Calendar size={12} />
                              <span className="text-[11px] font-mono whitespace-nowrap">{formatDate(entry.eventDate)}</span>
                            </div>
                          </div>

                          {/* Description — collapsible */}
                          {entry.description && (
                            <>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-sm text-muted-foreground leading-relaxed mb-3 overflow-hidden whitespace-pre-line"
                                  >
                                    {entry.description}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                              {!isExpanded && (
                                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                                  {entry.description}
                                </p>
                              )}
                              {entry.description.length > 120 && (
                                <button
                                  type="button"
                                  onClick={() => setExpanded(isExpanded ? null : entry.id)}
                                  className="text-[11px] text-primary hover:text-primary/80 font-semibold flex items-center gap-1 mb-3 transition-colors"
                                >
                                  {isExpanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Read full details</>}
                                </button>
                              )}
                            </>
                          )}

                          {/* Tags */}
                          {entry.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {entry.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-mono bg-primary/8 text-primary/80 border border-primary/15 px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
