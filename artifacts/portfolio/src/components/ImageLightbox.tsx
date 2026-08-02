import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@workspace/fel7o-ds/components/ui/dialog";

interface Props {
  images: string[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (idx: number) => void;
  title: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  open,
  onClose,
  onIndexChange,
  title,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onIndexChange((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        onIndexChange((currentIndex + 1) % images.length);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, images.length, onIndexChange, onClose]);

  if (!open || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-[95vw] w-full h-[92vh] p-0 border-none bg-black/95 text-white flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl"
        data-testid="image-lightbox"
      >
        {/* Lightbox Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white/90">{title}</span>
            {images.length > 1 && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-mono font-bold">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
            aria-label="Close Fullscreen View"
          >
            <X size={22} />
          </button>
        </div>

        {/* Main Image Display */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden p-4">
          <div
            className="absolute inset-0 scale-125 opacity-30 pointer-events-none filter blur-2xl transition-all duration-500"
            style={{
              backgroundImage: `url(${currentImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <img
            src={currentImg}
            alt={`${title} - View ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            className="relative z-10 max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-300"
          />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-primary hover:scale-110 transition-all border border-white/20 backdrop-blur-md z-30 shadow-xl cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={() => onIndexChange((currentIndex + 1) % images.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-primary hover:scale-110 transition-all border border-white/20 backdrop-blur-md z-30 shadow-xl cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Bottom Thumbnail Navigation Strip */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-3 p-4 bg-black/60 border-t border-white/10 overflow-x-auto z-30 flex-shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onIndexChange(idx)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 w-16 h-12 cursor-pointer ${
                  idx === currentIndex ? "border-primary ring-2 ring-primary/50 scale-105" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
