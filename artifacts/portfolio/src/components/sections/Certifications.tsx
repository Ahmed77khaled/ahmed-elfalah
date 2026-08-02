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
          <span className="text-sm font-mono uppercase tracking-widest text-primary">04. Credentials</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4">Certified Expertise</h2>
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
              className="glass-card text-left rounded-2xl p-5 hover:-translate-y-1 transition-transform group cursor-pointer border border-border hover:border-primary/50 relative overflow-hidden"
            >
              {cert.imagePreview && (
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none -mr-4 -mt-4">
                  <img src={cert.imagePreview} alt="" className="w-full h-full object-cover rounded-full filter blur-xs" />
                </div>
              )}
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
                {selected.imagePreview ? (
                  <div
                    className="relative rounded-xl overflow-hidden border border-border bg-black/40 group cursor-pointer shadow-lg transition-all hover:border-primary"
                    onClick={() => setLightboxOpen(true)}
                    title="Click to view full resolution certificate"
                  >
                    <img
                      src={selected.imagePreview}
                      alt={`${selected.title} Certificate`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-80 object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs">
                      <Maximize2 size={16} /> Enlarge Certificate Image
                    </div>
                  </div>
                ) : null}

                <p className="text-muted-foreground font-medium">Issued by {selected.issuer}</p>
                <div className="rounded-xl bg-primary/10 p-4 border border-primary/20">
                  <p className="font-semibold text-foreground">{selected.credential}</p>
                  <p className="text-primary font-bold mt-1">{selected.detail}</p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  {selected.evidenceUrl && (
                    <a
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:underline bg-primary/10 px-3.5 py-2 rounded-xl border border-primary/20 transition-all hover:bg-primary/20"
                      href={selected.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText size={16} /> View Certificate (PDF)
                    </a>
                  )}
                  {selected.verifyUrl && (
                    <a
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:underline bg-primary/10 px-3.5 py-2 rounded-xl border border-primary/20 transition-all hover:bg-primary/20"
                      href={selected.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify Credential <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                {!selected.evidenceUrl && !selected.verifyUrl && (
                  <p className="text-muted-foreground text-xs italic">Official credential documentation available upon request.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
