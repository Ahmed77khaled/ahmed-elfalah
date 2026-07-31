import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Plus, Pencil, Trash2, Star, X, Check } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";
import { api, type ProjectRow, type ProjectPayload } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";

const EMPTY: ProjectPayload = {
  title: "", subtitle: "", shortDescription: "", longDescription: "",
  coverImage: "", galleryImages: [], githubUrl: "", demoUrl: "",
  techStack: [], features: [], category: "", status: "published",
  featured: false, displayOrder: 0,
};

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  function add() {
    const v = input.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setInput("");
  }
  return (
    <div className="rounded-xl px-3 py-2 flex flex-wrap gap-1.5 min-h-[42px]"
      style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
      {value.map((t) => (
        <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))}><X size={10} /></button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
        onBlur={add}
        placeholder={placeholder ?? "Type and press Enter"}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none"
        style={{ color: "hsl(var(--foreground))" }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
        style={{ color: "hsl(var(--muted-foreground))" }}>{label}</label>
      {children}
    </div>
  );
}

function inputCls() {
  return "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
}
function inputStyle() {
  return { background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };
}

function ProjectForm({
  initial, onSave, onCancel, saving,
}: {
  initial: ProjectPayload;
  onSave: (p: ProjectPayload) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<ProjectPayload>(initial);
  const set = (k: keyof ProjectPayload, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-xl p-5 space-y-4"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title *">
          <input required className={inputCls()} style={inputStyle()} value={form.title}
            onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Subtitle">
          <input className={inputCls()} style={inputStyle()} value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)} />
        </Field>
      </div>

      <Field label="Short Description">
        <input className={inputCls()} style={inputStyle()} value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)} />
      </Field>

      <Field label="Long Description">
        <textarea rows={4} className={inputCls()} style={inputStyle()} value={form.longDescription}
          onChange={(e) => set("longDescription", e.target.value)} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="GitHub URL">
          <input type="url" className={inputCls()} style={inputStyle()} value={form.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)} />
        </Field>
        <Field label="Demo URL">
          <input type="url" className={inputCls()} style={inputStyle()} value={form.demoUrl}
            onChange={(e) => set("demoUrl", e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Category">
          <input className={inputCls()} style={inputStyle()} value={form.category}
            onChange={(e) => set("category", e.target.value)} placeholder="Web / AI / Tools…" />
        </Field>
        <Field label="Status">
          <select className={inputCls()} style={inputStyle()} value={form.status}
            onChange={(e) => set("status", e.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
      </div>

      <Field label="Tech Stack (Enter to add)">
        <TagInput value={form.techStack} onChange={(v) => set("techStack", v)} placeholder="React, TypeScript…" />
      </Field>

      <Field label="Features (Enter to add)">
        <TagInput value={form.features} onChange={(v) => set("features", v)} placeholder="Add a feature…" />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Cover Image URL">
          <input className={inputCls()} style={inputStyle()} value={form.coverImage}
            onChange={(e) => set("coverImage", e.target.value)} />
        </Field>
        <Field label="Display Order">
          <input type="number" className={inputCls()} style={inputStyle()} value={form.displayOrder}
            onChange={(e) => set("displayOrder", Number(e.target.value))} />
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)} className="rounded" />
        <label htmlFor="featured" className="text-sm text-foreground">Featured project</label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} size="sm">
          <Check size={13} className="mr-1.5" />{saving ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminProjects() {
  const search = useSearch();
  const openNew = new URLSearchParams(search).get("new") === "1";
  const editId = Number(new URLSearchParams(search).get("edit"));

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [creating, setCreating] = useState(openNew);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const rows = await api.getProjects();
      setProjects(rows);
      if (Number.isSafeInteger(editId) && editId > 0) setEditing(rows.find((project) => project.id === editId) ?? null);
    } catch { setError("Failed to load projects."); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(payload: ProjectPayload) {
    setSaving(true);
    try {
      const row = await api.createProject(payload);
      setProjects((p) => [...p, row]);
      setCreating(false);
      toast({ title: "Project created" });
    } catch { toast({ title: "Failed to create", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function handleUpdate(payload: ProjectPayload) {
    if (!editing) return;
    setSaving(true);
    try {
      const row = await api.updateProject(editing.id, payload);
      setProjects((p) => p.map((x) => x.id === row.id ? row : x));
      setEditing(null);
      toast({ title: "Project updated" });
    } catch { toast({ title: "Failed to update", variant: "destructive" }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await api.deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
    toast({ title: "Project deleted" });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{projects.length} projects</p>
        </div>
        {!creating && !editing && (
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus size={14} className="mr-1" /> Add Project
          </Button>
        )}
      </div>

      {creating && (
        <ProjectForm initial={EMPTY} onSave={handleCreate} onCancel={() => setCreating(false)} saving={saving} />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="rounded-xl animate-pulse" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", height: "80px" }} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) =>
            editing?.id === p.id ? (
              <ProjectForm key={p.id} initial={{ ...p }} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} />
            ) : (
              <div key={p.id} className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground truncate">{p.title}</span>
                    {p.featured && <Star size={12} style={{ color: "hsl(var(--primary))", fill: "hsl(var(--primary))" }} />}
                    <Badge variant={p.status === "published" ? "default" : "secondary"} className="text-xs">
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {p.shortDescription || p.subtitle || p.category}
                  </p>
                  {p.techStack.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {p.techStack.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>{t}</span>
                      ))}
                      {p.techStack.length > 4 && (
                        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>+{p.techStack.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setCreating(false); }}>
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            )
          )}
          {projects.length === 0 && !creating && (
            <div className="rounded-xl p-10 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No projects yet. Add your first one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
