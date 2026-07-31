import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Activity,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Database,
  Edit3,
  FolderKanban,
  HardDrive,
  MessageSquare,
  Plus,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";
import { api, validateSession, type DashboardStats, type MessageRow, type ProjectRow, type SkillRow } from "@/lib/admin-api";

interface DashboardData {
  stats: DashboardStats;
  projects: ProjectRow[];
  messages: MessageRow[];
  skills: SkillRow[];
}

const cardStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" };

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{children}</p>;
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setError("");
      const [dashboard, health, session] = await Promise.allSettled([
        Promise.all([api.stats(), api.getProjects(), api.getMessages(), api.getSkills()]),
        api.health(),
        validateSession(),
      ]);

      if (!active) return;
      setApiHealthy(health.status === "fulfilled" && health.value.status === "ok");
      setAuthenticated(session.status === "fulfilled" ? session.value : false);

      if (dashboard.status === "fulfilled") {
        const [stats, projects, messages, skills] = dashboard.value;
        setData({ stats, projects, messages, skills });
      } else {
        setError("Failed to load dashboard data.");
      }
    };

    void load();
    window.addEventListener("cms-data-changed", load);
    return () => {
      active = false;
      window.removeEventListener("cms-data-changed", load);
    };
  }, []);

  const recentProjects = data ? [...data.projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5) : [];
  const recentMessages = data ? [...data.messages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) : [];
  const draftProjects = data?.projects.filter((project) => project.status === "draft").length;
  const hiddenSkills = data?.skills.filter((skill) => !skill.visible).length;
  const pendingMessages = data?.messages.filter((message) => !message.read).length;

  const statCards = data ? [
    { label: "Projects", value: data.stats.projects, icon: FolderKanban, href: "/console/projects" },
    { label: "Skills", value: data.stats.skills, icon: Zap, href: "/console/skills" },
    { label: "Experience", value: data.stats.experience, icon: Briefcase, href: "/console/experience" },
    { label: "Messages", value: data.stats.messages, icon: MessageSquare, href: "/console/messages", badge: data.stats.unreadMessages },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "hsl(var(--primary))" }}>CMS overview</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>A live view of your portfolio content.</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data ? statCards.map(({ label, value, icon: Icon, href, badge }) => (
          <button key={label} onClick={() => navigate(href)} className="rounded-xl p-4 text-left transition-transform hover:scale-[1.02]" style={cardStyle}>
            <div className="mb-3 flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                <Icon size={16} style={{ color: "hsl(var(--primary))" }} />
              </span>
              {badge !== undefined && badge > 0 && <Badge>{badge}</Badge>}
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</div>
          </button>
        )) : Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[116px] animate-pulse rounded-xl" style={cardStyle} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl p-5" style={cardStyle}>
          <SectionHeader title="Recent Projects" action={<Button size="sm" variant="ghost" onClick={() => navigate("/console/projects")}>View All <ArrowRight size={14} className="ml-1" /></Button>} />
          {!data ? <EmptyState>Loading projects…</EmptyState> : recentProjects.length === 0 ? <EmptyState>No projects yet</EmptyState> : (
            <div className="mt-4 divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="h-11 w-14 shrink-0 overflow-hidden rounded-lg" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                    {project.coverImage ? <img src={project.coverImage} alt="" className="h-full w-full object-cover" /> : <FolderKanban className="m-3" size={20} style={{ color: "hsl(var(--primary))" }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{project.title}</p>
                    <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{project.category || "Uncategorized"} · Updated {formatTime(project.updatedAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={project.status === "published" ? "default" : "secondary"}>{project.status}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/console/projects?edit=${project.id}`)} aria-label={`Edit ${project.title}`}><Edit3 size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl p-5" style={cardStyle}>
          <SectionHeader title="Recent Messages" action={<Button size="sm" variant="ghost" onClick={() => navigate("/console/messages")}>View All <ArrowRight size={14} className="ml-1" /></Button>} />
          {!data ? <EmptyState>Loading messages…</EmptyState> : recentMessages.length === 0 ? <EmptyState>No messages yet</EmptyState> : (
            <div className="mt-4 divide-y" style={{ borderColor: "hsl(var(--border))" }}>
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>{message.name.slice(0, 1).toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{message.name}</p>
                    <p className="mt-0.5 truncate text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{message.subject}</p>
                    <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{formatTime(message.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!message.read && <Badge>Unread</Badge>}
                    <Button size="sm" variant="outline" onClick={() => navigate(`/console/messages?open=${message.id}`)}>Open</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl p-5" style={cardStyle}>
          <SectionHeader title="Draft Overview" />
          {!data ? <EmptyState>Loading overview…</EmptyState> : (
            <dl className="mt-4 space-y-4">
              {[['Draft Projects', draftProjects], ['Hidden Skills', hiddenSkills], ['Pending Messages', pendingMessages]].map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between"><dt className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</dt><dd className="font-semibold text-foreground">{value}</dd></div>
              ))}
            </dl>
          )}
        </section>

        <section className="rounded-xl p-5" style={cardStyle}>
          <SectionHeader title="Recent Activity" />
          <div className="mt-4 flex min-h-28 flex-col items-center justify-center text-center">
            <Activity size={22} style={{ color: "hsl(var(--muted-foreground))" }} />
            <p className="mt-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Activity tracking is not available yet.</p>
          </div>
        </section>

        <section className="rounded-xl p-5" style={cardStyle}>
          <SectionHeader title="Analytics" />
          <div className="mt-4 flex min-h-28 flex-col items-center justify-center text-center">
            <Sparkles size={22} style={{ color: "hsl(var(--primary))" }} />
            <p className="mt-3 text-sm font-medium text-foreground">Coming Soon</p>
            <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Analytics are not available from the current CMS API.</p>
          </div>
        </section>
      </div>

      <section className="rounded-xl p-5" style={cardStyle}>
        <SectionHeader title="System Status" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Authentication", icon: CheckCircle2, status: authenticated === true ? "Connected" : "Unknown", known: authenticated === true },
            { label: "Database", icon: Database, status: "Unknown", known: false },
            { label: "API", icon: Server, status: apiHealthy === true ? "Operational" : "Unknown", known: apiHealthy === true },
            { label: "Storage", icon: HardDrive, status: "Unknown", known: false },
          ].map(({ label, icon: Icon, status, known }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg p-3" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
              <Icon size={17} style={{ color: known ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }} />
              <div><p className="text-sm font-medium text-foreground">{label}</p><p className="text-xs" style={{ color: known ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>{status}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Quick Actions" />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Button className="justify-start" onClick={() => navigate("/console/projects?new=1")}><Plus size={15} className="mr-2" />Add Project</Button>
          <Button className="justify-start" variant="outline" onClick={() => navigate("/console/skills?new=1")}><Plus size={15} className="mr-2" />Add Skill</Button>
          <Button className="justify-start" variant="outline" onClick={() => navigate("/console/experience?new=1")}><Plus size={15} className="mr-2" />Add Experience</Button>
        </div>
      </section>
    </div>
  );
}
