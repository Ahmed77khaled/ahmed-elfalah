import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Plus, Pencil, Trash2, Check, MapPin } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api, type ExperienceRow, type ExperiencePayload } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";

const EMPTY: ExperiencePayload = {
  company: "", position: "", description: "",
  startDate: "", endDate: "", currentPosition: false,
  companyLogo: "", displayOrder: 0,
};

function inputCls() { return "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"; }
function inputStyle() { return { background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }; }

function ExpForm({ initial, onSave, onCancel, saving }: {
  initial: ExperiencePayload; onSave: (e: ExperiencePayload) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<ExperiencePayload>(initial);
  const set = (k: keyof ExperiencePayload, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-xl p-4 space-y-4"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Company *</label>
          <input required className={inputCls()} style={inputStyle()} value={form.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Position *</label>
          <input required className={inputCls()} style={inputStyle()} value={form.position} onChange={(e) => set("position", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Description</label>
        <textarea rows={3} className={inputCls()} style={inputStyle()} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Start Date</label>
          <input className={inputCls()} style={inputStyle()} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} placeholder="Jan 2023" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>End Date</label>
          <input className={inputCls()} style={inputStyle()} value={form.endDate} onChange={(e) => set("endDate", e.target.value)}
            placeholder="Present" disabled={form.currentPosition} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="current" checked={form.currentPosition}
          onChange={(e) => { set("currentPosition", e.target.checked); if (e.target.checked) set("endDate", "Present"); }} />
        <label htmlFor="current" className="text-sm text-foreground">Current position</label>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Company Logo URL</label>
          <input type="url" className={inputCls()} style={inputStyle()} value={form.companyLogo} onChange={(e) => set("companyLogo", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Display Order</label>
          <input type="number" className={inputCls()} style={inputStyle()} value={form.displayOrder} onChange={(e) => set("displayOrder", Number(e.target.value))} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} size="sm"><Check size={13} className="mr-1.5" />{saving ? "Saving…" : "Save"}</Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminExperience() {
  const search = useSearch();
  const openNew = new URLSearchParams(search).get("new") === "1";

  const [items, setItems] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [creating, setCreating] = useState(openNew);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try { setItems(await api.getExperience()); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(payload: ExperiencePayload) {
    setSaving(true);
    try {
      const row = await api.createExperience(payload);
      setItems((s) => [...s, row]);
      setCreating(false);
      toast({ title: "Experience added" });
    } catch { toast({ title: "Failed to create", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function handleUpdate(payload: ExperiencePayload) {
    if (!editing) return;
    setSaving(true);
    try {
      const row = await api.updateExperience(editing.id, payload);
      setItems((s) => s.map((x) => x.id === row.id ? row : x));
      setEditing(null);
      toast({ title: "Experience updated" });
    } catch { toast({ title: "Failed to update", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this experience?")) return;
    await api.deleteExperience(id);
    setItems((s) => s.filter((x) => x.id !== id));
    toast({ title: "Experience deleted" });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Experience</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{items.length} entries</p>
        </div>
        {!creating && !editing && (
          <Button size="sm" onClick={() => setCreating(true)}><Plus size={14} className="mr-1" /> Add Experience</Button>
        )}
      </div>

      {creating && <ExpForm initial={EMPTY} onSave={handleCreate} onCancel={() => setCreating(false)} saving={saving} />}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="rounded-xl animate-pulse" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", height: "88px" }} />)}</div>
      ) : items.length === 0 && !creating ? (
        <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) =>
            editing?.id === item.id ? (
              <ExpForm key={item.id} initial={{ ...item }} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} />
            ) : (
              <div key={item.id} className="rounded-xl p-4 flex gap-4"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                {item.companyLogo ? (
                  <img src={item.companyLogo} alt={item.company} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--primary) / 0.1)" }}>
                    <MapPin size={16} style={{ color: "hsl(var(--primary))" }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.position}</p>
                      <p className="text-xs mt-0.5" style={{ color: "hsl(var(--primary))" }}>{item.company}</p>
                      <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {item.startDate}{item.startDate && (item.endDate || item.currentPosition) ? " – " : ""}
                        {item.currentPosition ? "Present" : item.endDate}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(item); setCreating(false); }}><Pencil size={13} /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive"><Trash2 size={13} /></Button>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-xs mt-1.5 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>{item.description}</p>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
