import { useEffect, useState } from "react";
import { BellRing, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api, type ReminderPayload, type ReminderRow } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";

const EMPTY: ReminderPayload = { title: "", dueDate: "", notes: "", status: "pending" };
const inputClass = "w-full rounded-xl px-3 py-2.5 text-sm outline-none";
const inputStyle = { background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" };

function ReminderForm({ initial, onSave, onCancel, saving }: { initial: ReminderPayload; onSave: (value: ReminderPayload) => void; onCancel: () => void; saving: boolean }) {
  const [form, setForm] = useState(initial);
  return <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="space-y-3 rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / .3)" }}>
    <div className="grid gap-3 sm:grid-cols-[1fr_180px]"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={inputClass} style={inputStyle} placeholder="Training, certificate, project, or any follow-up" /><input required type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className={inputClass} style={inputStyle} /></div>
    <textarea rows={2} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className={inputClass} style={inputStyle} placeholder="Optional note: what needs to be added to the portfolio?" />
    <div className="flex items-center gap-3"><Button type="submit" size="sm" disabled={saving}><Check size={14} className="mr-1.5" />{saving ? "Saving..." : "Save reminder"}</Button><Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button></div>
  </form>;
}

export default function AdminReminders() {
  const [items, setItems] = useState<ReminderRow[]>([]); const [creating, setCreating] = useState(false); const [editing, setEditing] = useState<ReminderRow | null>(null); const [saving, setSaving] = useState(false);
  const load = () => void api.getReminders().then(setItems).catch(() => toast({ title: "Failed to load reminders", variant: "destructive" }));
  useEffect(load, []);
  const save = async (payload: ReminderPayload) => { setSaving(true); try { const item = editing ? await api.updateReminder(editing.id, payload) : await api.createReminder(payload); setItems((all) => editing ? all.map((entry) => entry.id === item.id ? item : entry) : [...all, item]); setCreating(false); setEditing(null); toast({ title: "Reminder saved" }); } catch { toast({ title: "Failed to save reminder", variant: "destructive" }); } finally { setSaving(false); } };
  const complete = async (item: ReminderRow) => { setSaving(true); try { const updated = await api.updateReminder(item.id, { title: item.title, dueDate: item.dueDate, notes: item.notes, status: "completed" }); setItems((all) => all.map((entry) => entry.id === updated.id ? updated : entry)); toast({ title: "Reminder marked complete" }); } catch { toast({ title: "Failed to update reminder", variant: "destructive" }); } finally { setSaving(false); } };
  const remove = async (id: number) => { if (!confirm("Delete this reminder?")) return; try { await api.deleteReminder(id); setItems((all) => all.filter((item) => item.id !== id)); } catch { toast({ title: "Failed to delete reminder", variant: "destructive" }); } };
  const pending = items.filter((item) => item.status === "pending");
  return <div className="mx-auto max-w-3xl space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold text-foreground">Follow-up reminders</h1><p className="mt-1 text-sm text-muted-foreground">Telegram is sent one day before and on the due date. Add certificates, proof, photos, and labs after completing work.</p></div>{!creating && !editing && <Button size="sm" onClick={() => setCreating(true)}><Plus size={14} className="mr-1" />Add reminder</Button>}</div>
    {creating && <ReminderForm initial={EMPTY} onSave={save} onCancel={() => setCreating(false)} saving={saving} />}
    <div className="space-y-3">{items.length === 0 ? <div className="rounded-xl p-10 text-center text-sm text-muted-foreground" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>No reminders yet.</div> : items.map((item) => editing?.id === item.id ? <ReminderForm key={item.id} initial={item} onSave={save} onCancel={() => setEditing(null)} saving={saving} /> : <div key={item.id} className="flex gap-3 rounded-xl p-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}><BellRing size={18} className={item.status === "completed" ? "text-muted-foreground" : "text-primary"} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-foreground">{item.title}</p><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{item.status}</span></div><p className="mt-1 text-xs text-muted-foreground">Due {item.dueDate}{item.notifiedBefore ? " · pre-reminder sent" : ""}{item.notifiedDue ? " · due-date reminder sent" : ""}</p>{item.notes && <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p>}</div><div className="flex shrink-0 gap-1">{item.status === "pending" && <Button size="sm" variant="ghost" onClick={() => complete(item)} title="Mark completed"><Check size={14} /></Button>}<Button size="sm" variant="ghost" onClick={() => { setEditing(item); setCreating(false); }}><Pencil size={14} /></Button><Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(item.id)}><Trash2 size={14} /></Button></div></div>)}</div>
    {pending.length > 0 && <p className="text-xs text-muted-foreground">{pending.length} pending reminder{pending.length === 1 ? "" : "s"}.</p>}
  </div>;
}
