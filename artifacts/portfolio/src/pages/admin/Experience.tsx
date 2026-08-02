import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Plus, Pencil, Trash2, Check, MapPin, Upload, Image, X, ArrowUp, ArrowDown, Scissors } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";
import { api, type ExperienceRow, type ExperiencePayload } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";
import { CropperModal } from "@/components/admin/CropperModal";

const EMPTY: ExperiencePayload = {
  company: "", position: "", description: "",
  startDate: "", endDate: "", currentPosition: false,
  companyLogo: "", type: "Training / Internship", galleryImages: [], displayOrder: 0,
};

function inputCls() { return "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"; }
function inputStyle() { return { background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }; }

function ExpGalleryInput({ value, onChange, onCrop }: { value: string[]; onChange: (v: string[]) => void; onCrop: (url: string, index: number) => void }) {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const add = () => {
    const url = input.trim();
    if (url && !value.includes(url)) onChange([...value, url]);
    setInput("");
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const media = await api.uploadMedia(file);
      if (!value.includes(media.url)) onChange([...value, media.url]);
      toast({ title: "Photo uploaded", description: "Added to training photos gallery." });
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Try another image.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Paste image URL, then click Add" className={inputCls()} style={inputStyle()} />
        <Button type="button" variant="outline" size="sm" onClick={add}>Add</Button>
      </div>
      <div className="flex items-center gap-3">
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent" style={{ borderColor: "hsl(var(--border))" }}>
          <Upload size={15} />
          {uploading ? "Uploading…" : "Upload Training Photo"}
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={upload} disabled={uploading} />
        </label>
        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>PNG, JPG, or WebP</span>
      </div>
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((url, index) => (
            <div key={url} className="flex items-center gap-3 rounded-xl p-2" style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
              <div className="relative w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "hsl(var(--muted))" }}>
                <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                <Image size={16} className="absolute opacity-40" />
              </div>
              <span className="text-xs font-mono flex-1 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{index + 1}. {url}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => onCrop(url, index)} title="Crop photo"><Scissors size={14} /></Button>
              <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up"><ArrowUp size={14} /></Button>
              <Button type="button" variant="ghost" size="sm" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label="Move down"><ArrowDown size={14} /></Button>
              <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onChange(value.filter((item) => item !== url))} aria-label="Remove photo"><X size={14} /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExpForm({ initial, onSave, onCancel, saving }: {
  initial: ExperiencePayload; onSave: (e: ExperiencePayload) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<ExperiencePayload>({
    ...initial,
    type: initial.type || "Training / Internship",
    galleryImages: initial.galleryImages || [],
  });
  const [cropState, setCropState] = useState<{ src: string; onSave: (url: string) => void } | null>(null);
  const set = (k: keyof ExperiencePayload, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-xl p-4 space-y-4 relative"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 0.3)" }}>
      {cropState && (
        <CropperModal
          src={cropState.src}
          onSave={cropState.onSave}
          onClose={() => setCropState(null)}
        />
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Company / Institution *</label>
          <input required className={inputCls()} style={inputStyle()} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. NTI / Factory Name" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Position / Title *</label>
          <input required className={inputCls()} style={inputStyle()} value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="e.g. Electrical Engineering Trainee" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Experience Type</label>
          <select className={inputCls()} style={inputStyle()} value={form.type || "Training / Internship"} onChange={(e) => set("type", e.target.value)}>
            <option value="Training / Internship">Training / Internship (تدريب)</option>
            <option value="Full-time">Full-time (دوام كامل)</option>
            <option value="Part-time">Part-time (دوام جزئي)</option>
            <option value="Freelance">Freelance (عمل حر)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Display Order</label>
          <input type="number" className={inputCls()} style={inputStyle()} value={form.displayOrder} onChange={(e) => set("displayOrder", Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Description</label>
        <textarea rows={3} className={inputCls()} style={inputStyle()} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe key skills, tasks, and achievements..." />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Start Date</label>
          <input className={inputCls()} style={inputStyle()} value={form.startDate} onChange={(e) => set("startDate", e.target.value)} placeholder="Jul 2024" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>End Date</label>
          <input className={inputCls()} style={inputStyle()} value={form.endDate} onChange={(e) => set("endDate", e.target.value)}
            placeholder="Aug 2024" disabled={form.currentPosition} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="current" checked={form.currentPosition}
          onChange={(e) => { set("currentPosition", e.target.checked); if (e.target.checked) set("endDate", "Present"); }} />
        <label htmlFor="current" className="text-sm text-foreground">Current position</label>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Company Logo / Icon URL</label>
        <input type="url" className={inputCls()} style={inputStyle()} value={form.companyLogo} onChange={(e) => set("companyLogo", e.target.value)} placeholder="https://..." />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Training / Experience Photos (Gallery)</label>
        <ExpGalleryInput
          value={form.galleryImages || []}
          onChange={(imgs) => set("galleryImages", imgs)}
          onCrop={(url, idx) => setCropState({
            src: url,
            onSave: (newUrl) => {
              const updated = [...(form.galleryImages || [])];
              updated[idx] = newUrl;
              set("galleryImages", updated);
              setCropState(null);
            }
          })}
        />
      </div>

      <div className="flex gap-3 pt-2">
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
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [creating, setCreating] = useState(openNew);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try { setItems(await api.getExperience()); } catch { setError("Failed to load experience."); } finally { setLoading(false); }
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

      {error && <p className="text-sm text-destructive">{error}</p>}

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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">{item.position}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type || "Training / Internship"}
                        </Badge>
                      </div>
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
                  {item.galleryImages && item.galleryImages.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                      <span className="text-xs font-medium mr-1" style={{ color: "hsl(var(--muted-foreground))" }}>📷 Photos ({item.galleryImages.length}):</span>
                      {item.galleryImages.slice(0, 5).map((img, i) => (
                        <img key={i} src={img} alt={`Training photo ${i+1}`} className="w-10 h-8 rounded border object-cover flex-shrink-0" />
                      ))}
                      {item.galleryImages.length > 5 && (
                        <span className="text-xs font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>+{item.galleryImages.length - 5}</span>
                      )}
                    </div>
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
