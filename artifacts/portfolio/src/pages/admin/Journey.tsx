import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, Upload, X, Image } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api, type JourneyRow, type JourneyPayload } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";

const CATEGORIES = ["education", "achievement", "personal", "project"] as const;

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  education:   { label: "Education",   color: "bg-primary/15 text-primary border-primary/30" },
  achievement: { label: "Achievement", color: "bg-amber-400/15 text-amber-400 border-amber-400/30" },
  personal:    { label: "Personal",    color: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30" },
  project:     { label: "Project",     color: "bg-violet-400/15 text-violet-400 border-violet-400/30" },
};

const EMPTY: JourneyPayload = {
  title: "",
  subtitle: "",
  description: "",
  eventDate: new Date().toISOString().slice(0, 10),
  category: "education",
  tags: [],
  imageUrl: "",
  imageCaption: "",
  galleryImages: [],
  highlight: false,
  displayOrder: 0,
};

function inputCls() { return "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"; }
function inputStyle() { return { background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }; }
function labelCls() { return "text-xs font-semibold mb-1.5 block"; }
function labelStyle() { return { color: "hsl(var(--muted-foreground))" }; }

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add tag, then press Enter"
          className={inputCls()}
          style={inputStyle()}
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>Add</Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full"
            >
              {tag}
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="hover:text-destructive transition-colors">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function JourneyForm({
  initial, onSave, onCancel, saving,
}: {
  initial: JourneyPayload; onSave: (data: JourneyPayload) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<JourneyPayload>({ ...initial });
  const [uploading, setUploading] = useState(false);
  const set = (k: keyof JourneyPayload, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const media = await api.uploadMedia(file);
      set("imageUrl", media.url);
      toast({ title: "Image uploaded", description: "Image URL has been set." });
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "Try another image.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-xl p-5 space-y-4"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 0.3)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <label className={labelCls()} style={labelStyle()}>Title *</label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g., Completed CCNA with 98%" className={inputCls()} style={inputStyle()} />
        </div>

        {/* Subtitle */}
        <div className="md:col-span-2">
          <label className={labelCls()} style={labelStyle()}>Subtitle</label>
          <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g., NTI — National Telecom Institute" className={inputCls()} style={inputStyle()} />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelCls()} style={labelStyle()}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What happened? What did you learn? How did it feel?"
            rows={4}
            className={inputCls()}
            style={{ ...inputStyle(), resize: "vertical" }}
          />
        </div>

        {/* Event Date */}
        <div>
          <label className={labelCls()} style={labelStyle()}>Date *</label>
          <input required type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} className={inputCls()} style={inputStyle()} />
        </div>

        {/* Category */}
        <div>
          <label className={labelCls()} style={labelStyle()}>Category *</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value as JourneyPayload["category"])}
            className={inputCls()}
            style={inputStyle()}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c].label}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className={labelCls()} style={labelStyle()}>Tags</label>
          <TagsInput value={form.tags} onChange={(v) => set("tags", v)} />
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className={labelCls()} style={labelStyle()}>Photo</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="Paste image URL (Google Photos, Imgur, Drive, etc.)"
                className={inputCls()}
                style={inputStyle()}
              />
              {form.imageUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={() => set("imageUrl", "")} title="Clear image">
                  <X size={16} />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-accent" style={{ borderColor: "hsl(var(--border))" }}>
                <Upload size={14} />
                {uploading ? "Uploading…" : "Upload from device"}
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadImage} disabled={uploading} />
              </label>
              <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>PNG, JPG, or WebP — max 3 MB</span>
            </div>

            {form.imageUrl && (
              <div className="relative w-40 h-28 rounded-xl overflow-hidden border" style={{ borderColor: "hsl(var(--border))" }}>
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <Image size={16} className="absolute top-2 right-2 text-white drop-shadow" />
              </div>
            )}
          </div>
        </div>

        {/* Image Caption */}
        <div className="md:col-span-2">
          <label className={labelCls()} style={labelStyle()}>Photo Caption</label>
          <input value={form.imageCaption} onChange={(e) => set("imageCaption", e.target.value)} placeholder="e.g., With CCNA classmates at NTI" className={inputCls()} style={inputStyle()} />
        </div>

        {/* Display Order */}
        <div>
          <label className={labelCls()} style={labelStyle()}>Display Order</label>
          <input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", Number(e.target.value))} className={inputCls()} style={inputStyle()} />
        </div>

        {/* Highlight */}
        <div className="flex items-center gap-3 self-end pb-2.5">
          <input
            id="highlight-toggle"
            type="checkbox"
            checked={form.highlight}
            onChange={(e) => set("highlight", e.target.checked)}
            className="w-4 h-4 accent-amber-400 cursor-pointer"
          />
          <label htmlFor="highlight-toggle" className="text-sm font-semibold cursor-pointer" style={{ color: "hsl(var(--foreground))" }}>
            ⭐ Mark as Milestone (highlighted)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Entry"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AdminJourneyPage() {
  const [entries, setEntries] = useState<JourneyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<JourneyRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.getJourney()
      .then(setEntries)
      .catch(() => toast({ title: "Failed to load journey entries", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (data: JourneyPayload) => {
    setSaving(true);
    try {
      await api.createJourney(data);
      toast({ title: "Entry created" });
      setCreating(false);
      load();
    } catch {
      toast({ title: "Failed to create entry", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleUpdate = async (data: JourneyPayload) => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.updateJourney(editing.id, data);
      toast({ title: "Entry updated" });
      setEditing(null);
      load();
    } catch {
      toast({ title: "Failed to update entry", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this journey entry? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.deleteJourney(id);
      toast({ title: "Entry deleted" });
      load();
    } catch {
      toast({ title: "Failed to delete entry", variant: "destructive" });
    } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "hsl(var(--foreground))" }}>Learning Journey</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"} — sorted by date
          </p>
        </div>
        {!creating && !editing && (
          <Button onClick={() => setCreating(true)} className="gap-2">
            <Plus size={16} /> New Entry
          </Button>
        )}
      </div>

      {/* Create Form */}
      {creating && (
        <JourneyForm
          initial={EMPTY}
          onSave={handleCreate}
          onCancel={() => setCreating(false)}
          saving={saving}
        />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && entries.length === 0 && !creating && (
        <div className="text-center py-16" style={{ color: "hsl(var(--muted-foreground))" }}>
          <Star size={36} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">No journey entries yet. Add your first milestone!</p>
        </div>
      )}

      {/* Entries Table */}
      {!loading && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id}>
              {editing?.id === entry.id ? (
                <JourneyForm
                  initial={{
                    title: entry.title,
                    subtitle: entry.subtitle,
                    description: entry.description,
                    eventDate: entry.eventDate,
                    category: entry.category,
                    tags: entry.tags ?? [],
                    imageUrl: entry.imageUrl,
                    imageCaption: entry.imageCaption,
                    galleryImages: entry.galleryImages ?? [],
                    highlight: entry.highlight,
                    displayOrder: entry.displayOrder,
                  }}
                  onSave={handleUpdate}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                />
              ) : (
                <div
                  className="flex items-start gap-4 rounded-xl p-4 transition-all"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                >
                  {/* Thumbnail */}
                  {entry.imageUrl ? (
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={entry.imageUrl} alt={entry.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: "hsl(var(--muted))" }}
                    >
                      <Star size={18} className="opacity-30" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm" style={{ color: "hsl(var(--foreground))" }}>
                        {entry.title}
                      </span>
                      {entry.highlight && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded-full">
                          ⭐ Milestone
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded-full ${CATEGORY_LABELS[entry.category]?.color}`}>
                        {CATEGORY_LABELS[entry.category]?.label}
                      </span>
                    </div>
                    {entry.subtitle && (
                      <p className="text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{entry.subtitle}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] font-mono" style={{ color: "hsl(var(--muted-foreground))" }}>
                        📅 {entry.eventDate}
                      </span>
                      {entry.tags?.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {entry.tags.slice(0, 4).map((t) => (
                            <span key={t} className="text-[10px] font-mono bg-primary/8 text-primary/70 px-1.5 py-0.5 rounded border border-primary/15">
                              {t}
                            </span>
                          ))}
                          {entry.tags.length > 4 && (
                            <span className="text-[10px] text-muted-foreground">+{entry.tags.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(entry)}
                      disabled={!!editing || creating}
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      title="Delete"
                    >
                      {deletingId === entry.id ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-destructive border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
