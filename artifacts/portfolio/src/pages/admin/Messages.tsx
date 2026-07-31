import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Mail, Trash2, Circle } from "lucide-react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { api, type MessageRow } from "@/lib/admin-api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminMessages() {
  const search = useSearch();
  const openId = Number(new URLSearchParams(search).get("open"));
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [selected, setSelected] = useState<MessageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const rows = await api.getMessages();
      setMessages(rows);
      if (Number.isSafeInteger(openId) && openId > 0) setSelected(rows.find((message) => message.id === openId) ?? null);
    } catch { setError("Failed to load messages."); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSelect(msg: MessageRow) {
    setSelected(msg);
    if (!msg.read) {
      await api.markRead(msg.id).catch(() => {});
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
    }
  }

  async function handleDelete(id: number) {
    await api.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Contact form submissions from your portfolio
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl p-4 animate-pulse" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", height: "72px" }} />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <Mail size={32} className="mx-auto mb-3" style={{ color: "hsl(var(--muted-foreground))" }} />
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No messages yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-4 items-start">
          {/* List */}
          <div className="space-y-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className="w-full text-left rounded-xl p-4 transition-all duration-200"
                style={{
                  background: selected?.id === msg.id ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
                  border: selected?.id === msg.id
                    ? "1px solid hsl(var(--primary) / 0.4)"
                    : "1px solid hsl(var(--border))",
                }}
              >
                <div className="flex items-start gap-2">
                  {!msg.read && (
                    <Circle size={8} className="mt-1.5 flex-shrink-0" style={{ color: "hsl(var(--primary))", fill: "hsl(var(--primary))" }} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium truncate ${msg.read ? "text-foreground" : ""}`}
                        style={!msg.read ? { color: "hsl(var(--primary))" } : {}}>
                        {msg.name}
                      </span>
                      <span className="text-xs flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {msg.subject}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected ? (
            <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{selected.subject}</h3>
                  <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {selected.name} · <a href={`mailto:${selected.email}`} className="hover:underline" style={{ color: "hsl(var(--primary))" }}>{selected.email}</a>
                  </p>
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{formatDate(selected.createdAt)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(selected.id)} className="text-destructive hover:text-destructive flex-shrink-0">
                  <Trash2 size={14} />
                </Button>
              </div>
              <hr style={{ borderColor: "hsl(var(--border))" }} />
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "hsl(var(--primary))" }}
              >
                <Mail size={14} /> Reply via email
              </a>
            </div>
          ) : (
            <div className="rounded-xl p-8 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Select a message to read it</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
