import { useEffect, useRef, useState } from "react";
import { useSearch } from "wouter";
import { AlertTriangle, ArrowDown, ArrowUp, Check, GripVertical, Image, Pencil, Plus, Scissors, Star, Trash2, Upload, X } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { Badge } from "@workspace/fel7o-ds/components/ui/badge";
import { api, type ProjectRow, type ProjectPayload } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";
import { CropperModal } from "@/components/admin/CropperModal";

const EMPTY: ProjectPayload = {
  title: "", subtitle: "", shortDescription: "", longDescription: "",
  coverImage: "", coverImagePosition: "center center", galleryImages: [], githubUrl: "", demoUrl: "",
  techStack: [], features: [], category: "", status: "published",
  featured: false, displayOrder: 0,
};

// ── Focal Point Picker ───────────────────────────────────────────────────────
const GRID_POINTS = [
  { label: "Top Left",     value: "0% 0%" },
  { label: "Top Center",   value: "50% 0%" },
  { label: "Top Right",    value: "100% 0%" },
  { label: "Left",         value: "0% 50%" },
  { label: "Center",       value: "50% 50%" },
  { label: "Right",        value: "100% 50%" },
  { label: "Bottom Left",  value: "0% 100%" },
  { label: "Bottom",       value: "50% 100%" },
  { label: "Bottom Right", value: "100% 100%" },
];

function FocalPointPicker({ coverImage, value, onChange, onCrop }: { coverImage: string; value: string; onChange: (v: string) => void; onCrop?: () => void }) {
  const parts = value.split(" ");
  const positionValue = (part: string | undefined, axis: "x" | "y") => {
    const fallback = 50;
    if (!part) return fallback;
    const parsed = Number.parseInt(part, 10);
    if (!Number.isNaN(parsed)) return parsed;
    if (part === "left" || part === "top") return 0;
    if (part === "right" || part === "bottom") return 100;
    return axis === "x" || part === "center" ? 50 : fallback;
  };
  const xNum = positionValue(parts[0], "x");
  const yNum = positionValue(parts[1], "y");
  const setXY = (x: number, y: number) => onChange(`${x}% ${y}%`);
  const imgRef = useRef<HTMLDivElement>(null);

  // Click anywhere on the preview image to set focal point
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onChange(`${x}% ${y}%`);
  };

  return (
    <div className="space-y-3">
      {/* Live Preview — 100% pixel-matched to public card (h-48 = 192px) */}
      {coverImage ? (
        <div
          ref={imgRef}
          className="relative aspect-[2/1] w-full rounded-xl overflow-hidden cursor-crosshair select-none group border shadow-md bg-black/40"
          style={{ borderColor: "hsl(var(--primary) / 0.5)" }}
          onClick={handleImageClick}
          title="Click anywhere on the image to set the focal point"
        >
          {/* Blurred backdrop layer (matches public site card) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={coverImage}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter blur-md scale-125 opacity-35"
              style={{ objectPosition: value }}
            />
          </div>

          {/* Main cover image */}
          <img
            src={coverImage}
            alt="focal point preview"
            referrerPolicy="no-referrer"
            draggable={false}
            className="relative z-10 w-full h-full object-cover pointer-events-none"
            style={{ objectPosition: value }}
          />

          {/* Crosshair dot */}
          <div
            className="absolute w-5 h-5 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 transition-all duration-150"
            style={{
              left: parts[0] ?? "50%",
              top: parts[1] ?? "50%",
              background: "hsl(var(--primary))",
              boxShadow: "0 0 0 2px rgba(0,0,0,0.6), 0 0 14px hsl(var(--primary) / 0.7)",
            }}
          />

          {/* Hint overlay */}
          <div className="absolute top-2 left-2 text-xs bg-black/75 text-white px-2.5 py-1 rounded-full z-20 backdrop-blur-sm flex items-center gap-1">
            <span>👆</span> Click to set focus (Card View)
          </div>

          {/* Crop button */}
          {onCrop && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onCrop(); }}
              className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground z-30 shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
              title="Crop and crop-to-fit this image"
            >
              <Scissors size={13} /> ✂️ Crop & Frame
            </button>
          )}

          <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/80 text-white px-2.5 py-0.5 rounded-full z-20 border border-white/10">{value}</div>
        </div>
      ) : (
        <div className="rounded-xl flex items-center justify-center text-sm" style={{ height: "120px", border: "2px dashed hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
          Enter a Cover Image URL above to enable focal point selection & cropping
        </div>
      )}

      {/* 3×3 Quick Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {GRID_POINTS.map((pt) => (
          <button
            key={pt.value}
            type="button"
            onClick={() => onChange(pt.value)}
            title={pt.label}
            className="py-2 text-xs rounded-lg border transition-all font-medium"
            style={{
              background: value === pt.value ? "hsl(var(--primary) / 0.12)" : "hsl(var(--background))",
              borderColor: value === pt.value ? "hsl(var(--primary))" : "hsl(var(--border))",
              color: value === pt.value ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
            }}
          >
            {pt.label}
          </button>
        ))}
      </div>

      {/* Fine-tune X / Y sliders */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Horizontal (X): {xNum}%</label>
          <input type="range" min={0} max={100} value={xNum} onChange={(e) => setXY(Number(e.target.value), yNum)} className="w-full cursor-pointer" style={{ accentColor: "hsl(var(--primary))" }} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>Vertical (Y): {yNum}%</label>
          <input type="range" min={0} max={100} value={yNum} onChange={(e) => setXY(xNum, Number(e.target.value))} className="w-full cursor-pointer" style={{ accentColor: "hsl(var(--primary))" }} />
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteConfirmModal({ projectTitle, onConfirm, onCancel }: { projectTitle: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }} onClick={onCancel}>
      <div
        className="rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(var(--destructive) / 0.12)" }}>
            <AlertTriangle size={20} style={{ color: "hsl(var(--destructive))" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Delete Project?</h3>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="font-medium text-foreground">"{projectTitle}"</span> will be permanently removed. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button type="button" size="sm" onClick={onConfirm}
            style={{ background: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>
            <Trash2 size={13} className="mr-1.5" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

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

function GalleryImageInput({ value, onChange, onCrop, coverImage, onSetCover }: { value: string[]; onChange: (v: string[]) => void; onCrop?: (url: string, index: number) => void; coverImage?: string; onSetCover: (url: string) => void }) {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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
  const moveTo = (source: number, target: number) => {
    if (source === target) return;
    const next = [...value];
    const [image] = next.splice(source, 1);
    next.splice(target, 0, image);
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
      toast({ title: "Image uploaded", description: "It was added to the end of this gallery." });
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Try another image.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };
  return <div className="space-y-3">
    <div className="flex gap-2">
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Paste an image URL, then click Add" className={inputCls()} style={inputStyle()} />
      <Button type="button" variant="outline" size="sm" onClick={add}>Add</Button>
    </div>
    <div className="flex items-center gap-3">
      <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent" style={{ borderColor: "hsl(var(--border))" }}>
        <Upload size={15} />
        {uploading ? "Uploading…" : "Upload from computer"}
        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={upload} disabled={uploading} />
      </label>
      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>PNG, JPG, or WebP — up to 3 MB</span>
    </div>
    {value.length > 0 && <div className="space-y-2">
      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Drag an image by its handle to arrange the public slider quickly. The first image appears first; use ✂️ to crop or × to remove.</p>
      {value.map((url, index) => <div
        key={url}
        draggable
        onDragStart={(event) => { setDraggedIndex(index); event.dataTransfer.effectAllowed = "move"; }}
        onDragEnd={() => setDraggedIndex(null)}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
        onDrop={(event) => { event.preventDefault(); if (draggedIndex !== null) moveTo(draggedIndex, index); setDraggedIndex(null); }}
        className="flex items-center gap-3 rounded-xl p-2 transition-all cursor-grab active:cursor-grabbing"
        style={{ background: draggedIndex === index ? "hsl(var(--primary) / 0.10)" : "hsl(var(--background))", border: `1px solid ${draggedIndex === index ? "hsl(var(--primary))" : "hsl(var(--border))"}`, opacity: draggedIndex === index ? 0.55 : 1 }}
      >
        <GripVertical size={17} className="flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }} aria-hidden="true" />
        <div className="relative w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "hsl(var(--muted))" }}>
          <img src={url} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <Image size={16} className="absolute opacity-40" />
        </div>
        <span className="text-xs font-mono flex-1 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{index + 1}. {url}</span>
        <Button type="button" variant={coverImage === url ? "secondary" : "ghost"} size="sm" onClick={() => onSetCover(url)} title="Use this image in the project card and cover preview" aria-label="Set as cover image">
          <Star size={14} className={coverImage === url ? "fill-current" : ""} />
        </Button>
        {onCrop && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onCrop(url, index)} title="Crop image"><Scissors size={14} /></Button>
        )}
        <Button type="button" variant="ghost" size="sm" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move image up"><ArrowUp size={14} /></Button>
        <Button type="button" variant="ghost" size="sm" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label="Move image down"><ArrowDown size={14} /></Button>
        <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onChange(value.filter((item) => item !== url))} aria-label="Remove image"><X size={14} /></Button>
      </div>)}
    </div>}
  </div>;
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
  const [cropState, setCropState] = useState<{ src: string; onSave: (url: string) => void } | null>(null);
  const set = (k: keyof ProjectPayload, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-xl p-5 space-y-4 relative"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>

      {cropState && (
        <CropperModal
          src={cropState.src}
          onSave={cropState.onSave}
          onClose={() => setCropState(null)}
        />
      )}
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

      <Field label="Cover Image — Focal Point (which part of the image to show)">
        <FocalPointPicker
          coverImage={form.coverImage}
          value={form.coverImagePosition ?? "center center"}
          onChange={(v) => set("coverImagePosition", v)}
          onCrop={form.coverImage ? () => setCropState({
            src: form.coverImage,
            onSave: (newUrl) => { set("coverImage", newUrl); setCropState(null); }
          }) : undefined}
        />
      </Field>

      <Field label="Gallery Images">
        <GalleryImageInput
          value={form.galleryImages}
          onChange={(v) => set("galleryImages", v)}
          coverImage={form.coverImage}
          onSetCover={(url) => { set("coverImage", url); set("coverImagePosition", "center center"); }}
          onCrop={(url, idx) => setCropState({
            src: url,
            onSave: (newUrl) => {
              const updated = [...form.galleryImages];
              updated[idx] = newUrl;
              set("galleryImages", updated);
              setCropState(null);
            }
          })}
        />
      </Field>

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
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);

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
    await api.deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
    setDeleteTarget(null);
    toast({ title: "Project deleted" });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          projectTitle={deleteTarget.title}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

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
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl animate-pulse flex gap-3 p-3" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", height: "80px" }}>
              <div className="w-20 h-full rounded-lg flex-shrink-0" style={{ background: "hsl(var(--muted))" }} />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 rounded" style={{ background: "hsl(var(--muted))", width: "60%" }} />
                <div className="h-2 rounded" style={{ background: "hsl(var(--muted))", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) =>
            editing?.id === p.id ? (
              <ProjectForm key={p.id} initial={{ ...p }} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} />
            ) : (
              <div key={p.id} className="rounded-xl p-3 flex items-center gap-3 group transition-colors hover:border-primary/40"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>

                {/* Cover Thumbnail */}
                <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: p.coverImagePosition || "center" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={18} style={{ color: "hsl(var(--muted-foreground))" }} />
                    </div>
                  )}
                  {/* Image count badge */}
                  {p.galleryImages.length > 0 && (
                    <div className="absolute bottom-0.5 right-0.5 text-xs font-bold bg-black/80 text-white px-1 rounded" style={{ fontSize: "9px", lineHeight: "14px" }}>
                      📷{p.galleryImages.length}
                    </div>
                  )}
                </div>

                {/* Info */}
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
                    <div className="flex gap-1 mt-1 flex-wrap">
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

                {/* Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(p); setCreating(false); }} title="Edit project">
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(p)} className="text-destructive hover:text-destructive" title="Delete project">
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
