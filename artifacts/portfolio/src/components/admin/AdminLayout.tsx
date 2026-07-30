import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { clearToken } from "@/lib/admin-api";
import { cn } from "@workspace/fel7o-ds/lib/utils";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { href: "/admin/skills", icon: Zap, label: "Skills" },
  { href: "/admin/experience", icon: Briefcase, label: "Experience" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);

  function logout() {
    clearToken();
    navigate("/admin/login");
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        "flex flex-col h-full",
        mobile ? "w-72" : "w-64",
      )}
      style={{ background: "hsl(var(--card))", borderRight: "1px solid hsl(var(--border))" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
          style={{ background: "hsl(var(--primary))", color: "hsl(var(--background))" }}
        >
          F
        </div>
        <div>
          <div className="text-sm font-bold text-foreground">Fel7o</div>
          <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Admin</div>
        </div>
        {mobile && (
          <button onClick={() => setOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = location === href || location.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <a
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "text-foreground"
                    : "hover:bg-white/5",
                )}
                style={
                  active
                    ? {
                        background: "hsl(var(--primary) / 0.12)",
                        color: "hsl(var(--primary))",
                        borderLeft: "3px solid hsl(var(--primary))",
                      }
                    : { color: "hsl(var(--muted-foreground))" }
                }
              >
                <Icon size={16} />
                {label}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-1" style={{ borderTop: "1px solid hsl(var(--border))" }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-white/5"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ExternalLink size={16} />
          View Portfolio
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-destructive/10"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          <button onClick={() => setOpen(true)} className="text-muted-foreground">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {NAV.find((n) => location === n.href || location.startsWith(n.href + "/"))?.label ?? "Admin"}
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
