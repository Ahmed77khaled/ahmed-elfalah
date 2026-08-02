import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@workspace/fel7o-ds/components/ui/button";
import { Check, RotateCcw, X } from "lucide-react";
import { api } from "@/lib/admin-api";
import { toast } from "@workspace/fel7o-ds/hooks/use-toast";

type HandleId = "move" | "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
interface Box { x: number; y: number; w: number; h: number; }

const CONTAINER_W = 660;
const CONTAINER_H = 440;
const MIN_CROP = 40;

const HANDLE_CURSORS: Record<HandleId, string> = {
  move: "grab", nw: "nw-resize", n: "n-resize", ne: "ne-resize",
  e: "e-resize", se: "se-resize", s: "s-resize", sw: "sw-resize", w: "w-resize",
};

interface Props {
  src: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

export function CropperModal({ src, onSave, onClose }: Props) {
  const [nat, setNat] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [box, setBox] = useState<Box>({ x: 0, y: 0, w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState<HandleId | null>(null);
  const [uploading, setUploading] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; sb: Box } | null>(null);

  // ── Init on image load ─────────────────────────────────────────────────────
  const initBox = useCallback((nw: number, nh: number) => {
    const s = Math.min(CONTAINER_W / nw, CONTAINER_H / nh, 1);
    const dw = nw * s;
    const dh = nh * s;
    const ox = (CONTAINER_W - dw) / 2;
    const oy = (CONTAINER_H - dh) / 2;
    setNat({ w: nw, h: nh });
    setScale(s);
    setOff({ x: ox, y: oy });
    const m = 0.04;
    setBox({ x: ox + dw * m, y: oy + dh * m, w: dw * (1 - 2 * m), h: dh * (1 - 2 * m) });
    setReady(true);
  }, []);

  const resetBox = () => setBox({ x: off.x, y: off.y, w: nat.w * scale, h: nat.h * scale });

  // ── Clamp box within image bounds ──────────────────────────────────────────
  const clamp = useCallback((b: Box): Box => {
    const maxX = off.x + nat.w * scale;
    const maxY = off.y + nat.h * scale;
    let { x, y, w, h } = b;
    w = Math.max(MIN_CROP, Math.min(w, maxX - x));
    h = Math.max(MIN_CROP, Math.min(h, maxY - y));
    x = Math.max(off.x, Math.min(x, maxX - w));
    y = Math.max(off.y, Math.min(y, maxY - h));
    return { x, y, w, h };
  }, [off, nat, scale]);

  // ── Mouse handling ─────────────────────────────────────────────────────────
  const startDrag = useCallback((e: React.MouseEvent, id: HandleId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(id);
    dragRef.current = { sx: e.clientX, sy: e.clientY, sb: { ...box } };
  }, [box]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const { sx, sy, sb } = dragRef.current;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      let { x, y, w, h } = sb;
      if (dragging === "move")  { x += dx; y += dy; }
      if (dragging === "nw")    { x += dx; y += dy; w -= dx; h -= dy; }
      if (dragging === "n")     { y += dy; h -= dy; }
      if (dragging === "ne")    { w += dx; y += dy; h -= dy; }
      if (dragging === "e")     { w += dx; }
      if (dragging === "se")    { w += dx; h += dy; }
      if (dragging === "s")     { h += dy; }
      if (dragging === "sw")    { x += dx; w -= dx; h += dy; }
      if (dragging === "w")     { x += dx; w -= dx; }
      setBox(clamp({ x, y, w, h }));
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, clamp]);

  // ── Apply crop → upload ────────────────────────────────────────────────────
  const handleApply = async () => {
    const realX = Math.round((box.x - off.x) / scale);
    const realY = Math.round((box.y - off.y) / scale);
    const realW = Math.round(box.w / scale);
    const realH = Math.round(box.h / scale);
    setUploading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = realW;
          canvas.height = realH;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, realX, realY, realW, realH, 0, 0, realW, realH);
          try {
            const blob = await new Promise<Blob>((res, rej) =>
              canvas.toBlob(b => b ? res(b) : rej(new Error("Blob failed")), "image/webp", 0.88)
            );
            const file = new File([blob], `cropped-${Date.now()}.webp`, { type: "image/webp" });
            const result = await api.uploadMedia(file);
            onSave(result.url);
            toast({ title: "✅ Cropped image saved!" });
            resolve();
          } catch (e) { reject(e); }
        };
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = src;
      });
    } catch {
      toast({ title: "Crop failed", description: "The image may be blocked by CORS. Try re-uploading it first.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handles: { id: HandleId; cx: number; cy: number }[] = [
    { id: "nw", cx: box.x,           cy: box.y },
    { id: "n",  cx: box.x + box.w/2, cy: box.y },
    { id: "ne", cx: box.x + box.w,   cy: box.y },
    { id: "e",  cx: box.x + box.w,   cy: box.y + box.h/2 },
    { id: "se", cx: box.x + box.w,   cy: box.y + box.h },
    { id: "s",  cx: box.x + box.w/2, cy: box.y + box.h },
    { id: "sw", cx: box.x,           cy: box.y + box.h },
    { id: "w",  cx: box.x,           cy: box.y + box.h/2 },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", maxWidth: CONTAINER_W + 40 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center gap-2">
            <span className="text-base">✂️</span>
            <span className="font-semibold text-foreground text-sm">Crop Image</span>
          </div>
          {ready && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
              {Math.round(box.w / scale)} × {Math.round(box.h / scale)} px
            </span>
          )}
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-accent transition-colors" style={{ color: "hsl(var(--muted-foreground))" }}>
            <X size={16} />
          </button>
        </div>

        {/* Canvas area */}
        <div
          className="relative overflow-hidden select-none"
          style={{
            width: CONTAINER_W,
            height: CONTAINER_H,
            background: "#111",
            backgroundImage: "linear-gradient(45deg,#222 25%,transparent 25%),linear-gradient(-45deg,#222 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#222 75%),linear-gradient(-45deg,transparent 75%,#222 75%)",
            backgroundSize: "18px 18px",
            backgroundPosition: "0 0,0 9px,9px -9px,-9px 0",
            cursor: dragging === "move" ? "grabbing" : "default",
          }}
        >
          {/* Image */}
          <img
            src={src}
            alt=""
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            className="absolute"
            style={{ left: off.x, top: off.y, width: nat.w * scale, height: nat.h * scale, display: "block", userSelect: "none", pointerEvents: "none" }}
            onLoad={(e) => { const i = e.currentTarget; initBox(i.naturalWidth, i.naturalHeight); }}
          />

          {ready && (
            <>
              {/* Dark mask: 4 areas */}
              <div className="absolute pointer-events-none" style={{ left: 0, top: 0, right: 0, height: box.y, background: "rgba(0,0,0,0.6)" }} />
              <div className="absolute pointer-events-none" style={{ left: 0, top: box.y + box.h, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)" }} />
              <div className="absolute pointer-events-none" style={{ left: 0, top: box.y, width: box.x, height: box.h, background: "rgba(0,0,0,0.6)" }} />
              <div className="absolute pointer-events-none" style={{ left: box.x + box.w, top: box.y, right: 0, height: box.h, background: "rgba(0,0,0,0.6)" }} />

              {/* Crop border */}
              <div
                className="absolute"
                style={{
                  left: box.x, top: box.y, width: box.w, height: box.h,
                  border: "2px solid rgba(255,255,255,0.9)",
                  cursor: HANDLE_CURSORS["move"],
                  boxSizing: "border-box",
                }}
                onMouseDown={(e) => startDrag(e, "move")}
              >
                {/* Rule-of-thirds grid */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.18) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.18) 1px,transparent 1px)",
                  backgroundSize: "33.33% 33.33%",
                }} />
              </div>

              {/* Handles */}
              {handles.map(({ id, cx, cy }) => (
                <div
                  key={id}
                  className="absolute"
                  style={{
                    left: cx - 6, top: cy - 6, width: 12, height: 12,
                    background: "white",
                    border: "2px solid hsl(var(--primary))",
                    borderRadius: "2px",
                    cursor: HANDLE_CURSORS[id],
                    zIndex: 10,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.6)",
                  }}
                  onMouseDown={(e) => startDrag(e, id)}
                />
              ))}

              {/* Dimensions tooltip inside crop box */}
              {box.w > 120 && box.h > 40 && (
                <div
                  className="absolute pointer-events-none text-xs font-mono text-white/70"
                  style={{ left: box.x + 6, top: box.y + 5 }}
                >
                  {Math.round(box.w / scale)}×{Math.round(box.h / scale)}
                </div>
              )}
            </>
          )}

          {/* Loading state */}
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "hsl(var(--primary))", borderTopColor: "transparent" }} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t gap-3" style={{ borderColor: "hsl(var(--border))" }}>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm transition-colors hover:text-foreground"
            style={{ color: "hsl(var(--muted-foreground))" }}
            onClick={resetBox}
            disabled={!ready}
          >
            <RotateCcw size={13} /> Reset
          </button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="button" size="sm" disabled={uploading || !ready} onClick={handleApply}>
              <Check size={13} className="mr-1.5" />
              {uploading ? "Uploading…" : "Apply Crop"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
