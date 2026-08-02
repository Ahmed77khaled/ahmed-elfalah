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
    issuer: "CCNA Training Program",
    detail: "98% Score · 120 hrs",
    credential: "Networking & Security",
    evidenceUrl: "/labs/ccna/ccna-routing-switching-certificate.pdf",
    imagePreview: "/labs/ccna/ccna-routing-switching-certificate.webp",
  },
  { title: "Artificial Intelligence", issuer: "NTI", detail: "100% Score · 80 hrs", credential: "AI Foundations" },
  { title: "ITI Python & Web Development", issuer: "Information Technology Institute", detail: "88+ hrs", credential: "Python · Web" },
  { title: "ACPC Egyptian Collegiate Programming Contest G2", issuer: "ACPC", detail: "80 hrs", credential: "Competitive Programming" },
  { title: "CS50x", issuer: "Harvard University", detail: "Introduction to Computer Science", credential: "Computer Science", verifyUrl: "https://cs50.harvard.edu/x/" },
  { title: "HCIA-AI", issuer: "Huawei", detail: "Artificial Intelligence", credential: "Huawei Certified" },
  { title: "Data Science", issuer: "Cisco Networking Academy", detail: "Data analytics foundations", credential: "Cisco Certified" },
  { title: "Networking Basics", issuer: "Cisco Networking Academy", detail: "Network infrastructure", credential: "Cisco Certified" },
  { title: "SQL Fundamentals", issuer: "DataCamp", detail: "Data querying & analysis", credential: "SQL" },
  { title: "Python Programming", issuer: "Cisco Networking Academy", detail: "Python Essentials", credential: "Programming" },
  { title: "Cybersecurity Essentials", issuer: "Cisco Networking Academy", detail: "Security foundations", credential: "Cybersecurity" },
  { title: "Introduction to IoT", issuer: "Cisco Networking Academy", detail: "Connected devices", credential: "IoT" },
  { title: "JavaScript Essentials", issuer: "Cisco Networking Academy", detail: "Modern web programming", credential: "JavaScript" },
  { title: "Linux Essentials", issuer: "Cisco Networking Academy", detail: "Command line & systems", credential: "Linux" },
  { title: "Web Development", issuer: "ITI", detail: "Frontend foundations", credential: "Web Development" },
  { title: "Problem Solving", issuer: "ACPC", detail: "Algorithms & data structures", credential: "Competitive Programming" },
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
          title={`${selected.title} - Certificate`}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={() => {}}
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-mono uppercase tracking-widest text-primary">04. Credentials</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4">Certified expertise</h2>
          <p className="text-lg mt-4 text-muted-foreground">16+ accredited milestones across engineering, AI, networking, and software.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.map((cert, i) => (
            <motion.button
              key={cert.title}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.035 }}
              onClick={() => setSelected(cert)}
              className="glass-card text-left rounded-2xl p-5 hover:-translate-y-1 transition-transform group cursor-pointer"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Award size={20} />
                </span>
                <ShieldCheck size={17} className="text-primary" />
              </div>
              <h3 className="font-bold leading-snug">{cert.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{cert.issuer}</p>
              <span className="inline-block mt-4 text-xs text-primary font-medium">{cert.detail}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <Dialog open onOpenChange={(open) => !open && setSelected(null)}>
            <DialogContent className="max-w-lg glass-card p-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                  <Award className="text-primary" />
                  {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm mt-2">
                {selected.imagePreview && (
                  <div
                    className="relative rounded-xl overflow-hidden border border-border bg-black/40 group cursor-pointer shadow-md"
                    onClick={() => setLightboxOpen(true)}
                    title="Click to view full resolution certificate"
                  >
                    <img
                      src={selected.imagePreview}
                      alt={`${selected.title} Certificate`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-72 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                      <Maximize2 size={16} /> Enlarge Certificate
                    </div>
                  </div>
                )}
                <p className="text-muted-foreground font-medium">Issued by {selected.issuer}</p>
                <div className="rounded-xl bg-primary/10 p-4 border border-primary/20">
                  <p className="font-semibold text-foreground">{selected.credential}</p>
                  <p className="text-primary font-bold mt-1">{selected.detail}</p>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  {selected.evidenceUrl && (
                    <a
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                      href={selected.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText size={16} /> View Certificate (PDF)
                    </a>
                  )}
                  {selected.verifyUrl && (
                    <a
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                      href={selected.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify credential <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                {!selected.evidenceUrl && !selected.verifyUrl && (
                  <p className="text-muted-foreground text-xs italic">Credential verification is available on request.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
