import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";

const FIELDS: { key: string; label: string; type?: string; placeholder?: string }[] = [
  { key: "email", label: "Email", type: "email", placeholder: "ahmed@example.com" },
  { key: "phone", label: "Phone / WhatsApp", placeholder: "+20 1XX XXX XXXX" },
  { key: "location", label: "Location", placeholder: "Port Said, Egypt" },
  { key: "linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/..." },
  { key: "github", label: "GitHub URL", type: "url", placeholder: "https://github.com/..." },
  { key: "facebook", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
  { key: "youtube", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
  { key: "resume_url", label: "Resume / CV URL", type: "url", placeholder: "https://..." },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings()
      .then(setValues)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveSettings(values);
      toast({ title: "Settings saved" });
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Contact info and social links
        </p>
      </div>

      <div className="rounded-xl p-6 space-y-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        {loading ? (
          <div className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <div className="h-4 w-24 rounded animate-pulse" style={{ background: "hsl(var(--border))" }} />
                <div className="h-10 rounded-xl animate-pulse" style={{ background: "hsl(var(--border))" }} />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {FIELDS.map(({ key, label, type = "text", placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                <input
                  type={type}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(var(--primary))")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
                />
              </div>
            ))}

            <div className="pt-2">
              <Button type="submit" disabled={saving} className="w-full">
                <Save size={14} className="mr-2" />
                {saving ? "Saving…" : "Save Settings"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
