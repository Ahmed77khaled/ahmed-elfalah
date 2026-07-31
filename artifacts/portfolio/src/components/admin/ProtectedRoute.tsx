import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { validateSession } from "@/lib/admin-api";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    const validate = async () => {
      const valid = await validateSession();
      if (!active) return;
      setAuthenticated(valid);
      if (!valid) navigate("/console/login");
    };
    const handleExpired = () => {
      if (!active) return;
      setAuthenticated(false);
      navigate("/console/login");
    };

    void validate();
    window.addEventListener("admin-session-expired", handleExpired);
    const interval = window.setInterval(() => { void validate(); }, 60_000);
    return () => {
      active = false;
      window.removeEventListener("admin-session-expired", handleExpired);
      window.clearInterval(interval);
    };
  }, [navigate]);

  if (authenticated !== true) return null;

  return <>{children}</>;
}
