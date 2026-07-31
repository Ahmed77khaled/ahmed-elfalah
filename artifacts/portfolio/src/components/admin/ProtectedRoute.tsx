import { useEffect } from "react";
import { useLocation } from "wouter";
import { isAuthenticated } from "@/lib/admin-api";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/console/login");
    }
  }, [navigate]);

  if (!isAuthenticated()) return null;

  return <>{children}</>;
}
