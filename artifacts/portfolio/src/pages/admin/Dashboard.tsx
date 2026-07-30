import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { FolderKanban, Zap, Briefcase, MessageSquare, Plus } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api } from "@/lib/admin-api";

interface Stats {
  projects: number;
  skills: number;
  experience: number;
  messages: number;
  unreadMessages: number;
}

const STAT_CARDS = (s: Stats) => [
  { label: "Projects", value: s.projects, icon: FolderKanban, href: "/admin/projects" },
  { label: "Skills", value: s.skills, icon: Zap, href: "/admin/skills" },
  { label: "Experience", value: s.experience, icon: Briefcase, href: "/admin/experience" },
  {
    label: "Messages",
    value: s.messages,
    icon: MessageSquare,
    href: "/admin/messages",
    badge: s.unreadMessages > 0 ? s.unreadMessages : undefined,
  },
];

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.stats()
      .then(setStats)
      .catch(() => setError("Failed to load stats"));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Overview of your portfolio content
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats
          ? STAT_CARDS(stats).map(({ label, value, icon: Icon, href, badge }) => (
              <button
                key={label}
                onClick={() => navigate(href)}
                className="rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "hsl(var(--primary) / 0.1)" }}
                  >
                    <Icon size={15} style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  {badge !== undefined && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "hsl(var(--primary))", color: "hsl(var(--background))" }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {label}
                </div>
              </button>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-4 animate-pulse"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", height: "110px" }}
              />
            ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider"
          style={{ color: "hsl(var(--muted-foreground))" }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/admin/projects?new=1")} size="sm">
            <Plus size={14} className="mr-1" /> Add Project
          </Button>
          <Button onClick={() => navigate("/admin/skills?new=1")} variant="outline" size="sm">
            <Plus size={14} className="mr-1" /> Add Skill
          </Button>
          <Button onClick={() => navigate("/admin/experience?new=1")} variant="outline" size="sm">
            <Plus size={14} className="mr-1" /> Add Experience
          </Button>
        </div>
      </div>
    </div>
  );
}
