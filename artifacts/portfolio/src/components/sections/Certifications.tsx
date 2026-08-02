import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/fel7o-ds/components/ui/dialog";

type Certification = { title: string; issuer: string; detail: string; credential: string; verifyUrl?: string; evidenceUrl?: string; imagePreview?: string };
const certifications: Certification[] = [
  { title: "CCNA Routing and Switching", issuer: "CCNA Training Program", detail: "98% Score · 120 hrs", credential: "Networking & Security", evidenceUrl: "/labs/ccna/ccna-routing-switching-certificate.pdf", imagePreview: "/labs/ccna/hands-on-networking-training.jpg" },
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
  return <section id="certifications" className="relative py-24 md:py-32" data-testid="certifications-section">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-14"><span className="text-sm font-mono uppercase tracking-widest text-primary">04. Credentials</span><h2 className="text-4xl md:text-5xl font-black mt-4">Certified expertise</h2><p className="text-lg mt-4 text-muted-foreground">16+ accredited milestones across engineering, AI, networking, and software.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{certifications.map((cert, i) => <motion.button key={cert.title} type="button" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .035 }} onClick={() => setSelected(cert)} className="glass-card text-left rounded-2xl p-5 hover:-translate-y-1 transition-transform group" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex justify-between items-start mb-6"><span className="p-2 rounded-lg bg-primary/10 text-primary"><Award size={20}/></span><ShieldCheck size={17} className="text-primary" /></div><h3 className="font-bold leading-snug">{cert.title}</h3><p className="text-sm text-muted-foreground mt-2">{cert.issuer}</p><span className="inline-block mt-4 text-xs text-primary font-medium">{cert.detail}</span>
      </motion.button>)}</div>
    </div>
    <AnimatePresence>{selected && <Dialog open onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-w-md glass-card"><DialogHeader><DialogTitle className="flex items-center gap-2"><Award className="text-primary" />{selected.title}</DialogTitle></DialogHeader><div className="space-y-4 text-sm">{selected.imagePreview && <div className="rounded-xl overflow-hidden border border-border h-48 w-full"><img src={selected.imagePreview} alt={selected.title} className="w-full h-full object-cover" /></div>}<p className="text-muted-foreground">Issued by {selected.issuer}</p><div className="rounded-xl bg-primary/10 p-4"><p className="font-semibold">{selected.credential}</p><p className="text-primary mt-1">{selected.detail}</p></div><div className="flex flex-wrap gap-4">{selected.evidenceUrl && <a className="inline-flex items-center gap-2 text-primary font-medium" href={selected.evidenceUrl} target="_blank" rel="noopener noreferrer"><FileText size={14}/>View certificate</a>}{selected.verifyUrl && <a className="inline-flex items-center gap-2 text-primary font-medium" href={selected.verifyUrl} target="_blank" rel="noopener noreferrer">Verify credential <ExternalLink size={14}/></a>}</div>{!selected.evidenceUrl && !selected.verifyUrl && <p className="text-muted-foreground">Credential verification is available on request.</p>}</div></DialogContent></Dialog>}</AnimatePresence>
  </section>;
}
