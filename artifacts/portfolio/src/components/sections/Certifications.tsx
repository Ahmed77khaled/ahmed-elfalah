import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, FileText, ShieldCheck, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/fel7o-ds/components/ui/dialog";
import { ImageLightbox } from "@/components/ImageLightbox";

type Certification = {
  title: string;
  issuer: string;
  detail: string;
  credential: string;
  verifyUrl?: string;
  evidenceUrl?: string;
  imagePreview?: string;
};

const certifications: Certification[] = [
  {
    title: "CCNA Routing and Switching",
    issuer: "CCNA Training Program (NTI)",
    detail: "98% Score · 120 hrs",
    credential: "Networking & Security",
    evidenceUrl: "/certificates/nti-ccna.pdf",
    imagePreview: "/certificates/nti-ccna.webp",
  },
  {
    title: "Artificial Intelligence",
    issuer: "NTI (National Telecommunication Institute)",
    detail: "100% Score · 80 hrs",
    credential: "AI Foundations",
    evidenceUrl: "/certificates/nti-ai.pdf",
    imagePreview: "/certificates/nti-ai.webp",
  },
  {
    title: "HCIA-AI V4.0 Certification",
    issuer: "Huawei Certified",
    detail: "Artificial Intelligence",
    credential: "Huawei AI Certified",
    imagePreview: "/certificates/hcia-ai.webp",
  },
  {
    title: "CS50x",
    issuer: "Harvard University",
    detail: "Introduction to Computer Science",
    credential: "Computer Science",
    verifyUrl: "https://cs50.harvard.edu/x/",
    evidenceUrl: "/certificates/cs50x.pdf",
    imagePreview: "/certificates/cs50x.webp",
  },
  {
    title: "ITI Python & Web Development",
    issuer: "Information Technology Institute (ITI)",
    detail: "88+ hrs",
    credential: "Python · Web",
    evidenceUrl: "/certificates/python-en.pdf",
    imagePreview: "/certificates/python-en.webp",
  },
  {
    title: "Python Programming",
    issuer: "Cisco Networking Academy",
    detail: "Python Essentials",
    credential: "Programming",
    evidenceUrl: "/certificates/python-cisco.pdf",
    imagePreview: "/certificates/python-cisco.webp",
  },
  {
    title: "Introduction to Data Science",
    issuer: "Cisco Networking Academy",
    detail: "Data Analytics Foundations",
    credential: "Cisco Certified",
    evidenceUrl: "/certificates/data-science.pdf",
    imagePreview: "/certificates/data-science.webp",
  },
  {
    title: "Networking Basics & Infrastructure",
    issuer: "Cisco Networking Academy",
    detail: "Network Infrastructure",
    credential: "Cisco Certified",
    evidenceUrl: "/certificates/cisco-networking.pdf",
    imagePreview: "/certificates/cisco-networking.webp",
  },
  {
    title: "UI/UX Design Certification",
    issuer: "Design & UX Academy",
    detail: "User Interface & Experience Design",
    credential: "UI/UX Design",
    imagePreview: "/certificates/ui-ux-design.webp",
  },
  {
    title: "Professional Freelancing",
    issuer: "MaharaTech / Digital Egypt",
    detail: "Freelance Work & Business",
    credential: "Freelancing & Soft Skills",
    evidenceUrl: "/certificates/freelancing.pdf",
    imagePreview: "/certificates/freelancing.webp",
  },
  {
    title: "SQL & Data Analytics",
    issuer: "DataCamp",
    detail: "Data Querying & Analysis",
    credential: "SQL & Databases",
    evidenceUrl: "/certificates/python-datacamp.pdf",
    imagePreview: "/certificates/python-datacamp.webp",
  },
  {
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    detail: "Security Foundations",
    credential: "Cybersecurity",
    evidenceUrl: "/certificates/cisco-cert-1.pdf",
    imagePreview: "/certificates/cisco-cert-1.webp",
  },
  {
    title: "Introduction to IoT",
    issuer: "Cisco Networking Academy",
    detail: "Connected Devices & Sensors",
    credential: "IoT",
    evidenceUrl: "/certificates/cisco-cert-2.pdf",
    imagePreview: "/certificates/cisco-cert-2.webp",
  },
  {
    title: "ACPC Egyptian Collegiate Programming Contest G2",
    issuer: "ACPC",
    detail: "80 hrs",
    credential: "Competitive Programming",
  },
  {
    title: "Linux Essentials",
    issuer: "Cisco Networking Academy",
    detail: "Command Line & Systems",
    credential: "Linux Systems",
  },
  {
    title: "Problem Solving & Algorithms",
    issuer: "ACPC / Codeforces",
    detail: "Algorithms & Data Structures",
    credential: "Competitive Programming",
  },
];

export function Certifications() {
  const [selected, setSelected] = useState<Certification | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section id="certifications" className="relative py-24 md:py-32" data-testid="certifications-section">
      {selected?.imagePreview && (
        <ImageLightbox
          open={lightboxOpen}
          images={[selected.imagePreview]}
          currentIndex={0}
          title={`${selected.title} - Official Certificate`}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={() => {}}
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
            <span className="text-sm font-mono uppercase tracking-widest text-primary">04. Credentials</span>
            <div className="h-px w-12" style={{ background: "hsl(var(--primary))" }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground">Certified Expertise</h2>
          <p className="text-lg mt-4 text-muted-foreground max-w-xl mx-auto">
            Accredited certificates and milestones across engineering, AI, networking, and software development.
          </p>
        </div>

        {/* Card Grid with Image Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certifications.map((cert, i) => (
            <motion.button
              key={cert.title}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.035 }}
              onClick={() => setSelected(cert)}
              className="glass-card text-left rounded-2xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer border border-border hover:border-primary/50 hover:shadow-xl flex flex-col justify-between"
            >
              {/* Card Image Container */}
              <div className="relative w-full aspect-[4/3] bg-black/40 border-b border-border/50 overflow-hidden flex items-center justify-center">
                {cert.imagePreview ? (
                  <>
                    <img
                      src={cert.imagePreview}
                      alt={cert.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-[2px]">
                      <Maximize2 size={16} /> View Certificate
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary/10 to-accent/5">
                    <span className="p-3 rounded-full bg-primary/15 text-primary mb-2 group-hover:scale-110 transition-transform">
                      <Award size={28} />
                    </span>
                    <span className="text-xs font-semibold text-primary/80">{cert.credential}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 z-10">
                  <ShieldCheck size={18} className="text-primary drop-shadow-md" />
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-1.5 line-clamp-1">{cert.issuer}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    {cert.detail}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                    Details &rarr;
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail Dialog Modal */}
      <AnimatePresence>
        {selected && (
          <Dialog open onOpenChange={(open) => !open && setSelected(null)}>
            <DialogContent className="max-w-lg glass-card p-6 border-primary/30 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
                  <Award className="text-primary flex-shrink-0" size={22} />
                  {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm mt-3">
                {selected.imagePreview ? (
                  <div
                    className="relative rounded-2xl overflow-hidden border border-primary/30 bg-black/60 group cursor-pointer shadow-xl transition-all hover:border-primary"
                    onClick={() => setLightboxOpen(true)}
                    title="Click to view full resolution certificate"
                  >
                    <img
                      src={selected.imagePreview}
                      alt={`${selected.title} Certificate`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-80 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs backdrop-blur-xs">
                      <Maximize2 size={18} /> Enlarge Full Resolution Certificate
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2">
                  <span>Issuer: <strong className="text-foreground">{selected.issuer}</strong></span>
                  <span className="font-mono text-primary font-bold">{selected.detail}</span>
                </div>

                <div className="rounded-xl bg-primary/10 p-4 border border-primary/20">
                  <p className="font-semibold text-foreground">{selected.credential}</p>
                  <p className="text-xs text-muted-foreground mt-1">Official certification & verified achievement.</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {selected.imagePreview && (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/15 hover:bg-primary/25 px-4 py-2.5 rounded-xl border border-primary/30 transition-all cursor-pointer text-xs"
                    >
                      <Maximize2 size={15} /> Open Fullscreen Image
                    </button>
                  )}
                  {selected.evidenceUrl && (
                    <a
                      className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl border border-primary/20 transition-all text-xs"
                      href={selected.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText size={15} /> View Certificate (PDF)
                    </a>
                  )}
                  {selected.verifyUrl && (
                    <a
                      className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/10 hover:bg-primary/20 px-4 py-2.5 rounded-xl border border-primary/20 transition-all text-xs"
                      href={selected.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify Credential <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
