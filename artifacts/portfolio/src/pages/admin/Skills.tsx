import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Plus, Pencil, Trash2, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api, type SkillRow, type SkillPayload } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";

const EMPTY: SkillPayload = { name: "", icon: "", percentage: 80, category: "", visible: true, displayOrder: 0 };

function inputCls() { return "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"; }
function inputStyle() { return { background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }; }

function SkillForm({ initial, onSave, onCancel, saving }: {
  initial: SkillPayload; onSave: (s: SkillPayload) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<SkillPayload>(initial);
  const set = (k: keyof SkillPayload, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-xl p-4 space-y-4"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Name *</label>
          <input required className={inputCls()} style={inputStyle()} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="React" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Category</label>
          <input className={inputCls()} style={inputStyle()} value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Frontend / Backend…" />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Proficiency %</label>
          <input type="number" min={0} max={100} className={inputCls()} style={inputStyle()}
            value={form.percentage} onChange={(e) => set("percentage", Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Icon (emoji or text)</label>
          <input className={inputCls()} style={inputStyle()} value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="⚛️" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Order</label>
          <input type="number" className={inputCls()} style={inputStyle()}
            value={form.displayOrder} onChange={(e) => set("displayOrder", Number(e.target.value))} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="skill-visible" checked={form.visible} onChange={(e) => set("visible", e.target.checked)} />
        <label htmlFor="skill-visible" className="text-sm text-foreground">Visible on portfolio</label>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} size="sm"><Check size={13} className="mr-1.5" />{saving ? "Saving…" : "Save"}</Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminSkills() {
  const search = useSearch();
  const openNew = new URLSearchParams(search).get("new") === "1";

  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<SkillRow | null>(null);
  const [creating, setCreating] = useState(openNew);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try { setSkills(await api.getSkills()); } catch { setError("Failed to load skills."); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(payload: SkillPayload) {
    setSaving(true);
    try {
      const row = await api.createSkill(payload);
      setSkills((s) => [...s, row]);
      setCreating(false);
      toast({ title: "Skill added" });
    } catch { toast({ title: "Failed to create", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function handleUpdate(payload: SkillPayload) {
    if (!editing) return;
    setSaving(true);
    try {
      const row = await api.updateSkill(editing.id, payload);
      setSkills((s) => s.map((x) => x.id === row.id ? row : x));
      setEditing(null);
      toast({ title: "Skill updated" });
    } catch { toast({ title: "Failed to update", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this skill?")) return;
    await api.deleteSkill(id);
    setSkills((s) => s.filter((x) => x.id !== id));
    toast({ title: "Skill deleted" });
  }

  async function toggleVisible(skill: SkillRow) {
    try {
      const nextVisible = !skill.visible;
      const row = await api.updateSkill(skill.id, { visible: nextVisible });
      setSkills((s) => s.map((x) => (x.id === row.id ? row : x)));
      toast({
        title: nextVisible ? "Skill visible" : "Skill hidden",
        description: nextVisible ? `"${skill.name}" is now shown on portfolio.` : `"${skill.name}" is hidden from public view.`,
      });
    } catch {
      toast({ title: "Failed to update visibility", variant: "destructive" });
    }
  }

  // Filter out any blank skill rows and group by category
  const validSkills = skills.filter((s) => s.name && s.name.trim() !== "");

  const groups = validSkills.reduce<Record<string, SkillRow[]>>((acc, s) => {
    const k = s.category || "Other";
    (acc[k] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skills</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{validSkills.length} skills</p>
        </div>
        {!creating && !editing && (
          <Button size="sm" onClick={() => setCreating(true)}><Plus size={14} className="mr-1" /> Add Skill</Button>
        )}
      </div>

      {creating && <SkillForm initial={EMPTY} onSave={handleCreate} onCancel={() => setCreating(false)} saving={saving} />}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="space-y-2">{[1,2,3,4].map((i) => <div key={i} className="rounded-xl animate-pulse" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", height: "60px" }} />)}</div>
      ) : validSkills.length === 0 && !creating ? (
        <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No skills yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>{cat}</h2>
              <div className="space-y-2">
                {items.map((s) =>
                  editing?.id === s.id ? (
                    <SkillForm key={s.id} initial={{ ...s }} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} />
                  ) : (
                    <div key={s.id} className="rounded-xl px-4 py-3 flex items-center gap-3 transition-opacity"
                      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", opacity: s.visible ? 1 : 0.65 }}>
                      {s.icon && <span className="text-lg flex-shrink-0">{s.icon}</span>}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{s.name}</span>
                          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.percentage}%</span>
                          {!s.visible && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Hidden</span>
                          )}
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
                          <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, background: s.visible ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }} />
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => toggleVisible(s)} title={s.visible ? "Hide on portfolio" : "Show on portfolio"}>
                          {s.visible ? <Eye size={14} className="text-primary" /> : <EyeOff size={14} className="text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(s); setCreating(false); }} title="Edit skill"><Pencil size={13} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive" title="Delete skill"><Trash2 size={13} /></Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
