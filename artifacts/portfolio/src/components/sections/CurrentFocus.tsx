import { motion } from "framer-motion";
import { Activity, Bolt, Server, ShieldCheck, Workflow } from "lucide-react";

const focusItems = [
  { label: "Electrical Training", detail: "Ends 6 August", icon: Bolt, status: "Finishing soon" },
  { label: "System Administration", detail: "Started 2 July · ongoing", icon: Server, status: "In progress" },
  { label: "DevOps", detail: "Week 3", icon: Workflow, status: "In progress" },
  { label: "HCIA-Security", detail: "Starts August · 80 hours", icon: ShieldCheck, status: "Upcoming" },
];

export function CurrentFocus() {
  return (
    <section className="relative pb-16 md:pb-20" aria-labelledby="current-focus-title" data-testid="current-focus-section">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-5 md:p-6" style={{ borderColor: "hsl(var(--primary) / .22)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><Activity size={16}/></span><div><h2 id="current-focus-title" className="font-bold">Current Focus</h2><p className="text-xs text-muted-foreground">What I’m learning and building right now</p></div></div><span className="text-xs font-mono text-primary">AUG 2026</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">{focusItems.map(({ label, detail, icon: Icon, status }) => <div key={label} className="rounded-xl border border-border/70 bg-background/30 p-4"><div className="flex items-start justify-between gap-2"><Icon size={18} className="text-primary"/><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{status}</span></div><p className="mt-4 text-sm font-bold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}</div>
        </motion.div>
      </div>
    </section>
  );
}
