import { useState } from "react";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api, setToken, isAuthenticated } from "@/lib/admin-api";
import { useEffect } from "react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) navigate("/admin/dashboard");
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(password);
      setToken(token);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid password. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-4"
            style={{ background: "hsl(var(--primary))", color: "hsl(var(--background))" }}
          >
            F
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Fel7o Portfolio Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "hsl(var(--primary))")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "hsl(var(--border))")
                  }
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-xs text-destructive">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !password}
            >
              {loading ? "Verifying…" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "hsl(var(--muted-foreground))" }}>
          <a href="/" className="hover:underline" style={{ color: "hsl(var(--primary))" }}>
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
