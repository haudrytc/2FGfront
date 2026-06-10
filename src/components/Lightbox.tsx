import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: { url: string; caption?: string }[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button className="absolute right-5 top-5 text-white/80 hover:text-white" onClick={onClose}>
            <X size={32} />
          </button>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-clay-600"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
              >
                <ChevronLeft />
              </button>
              <button
                className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-clay-600"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
              >
                <ChevronRight />
              </button>
            </>
          )}
          <motion.figure
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[index].url}
              alt=""
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {images[index].caption && (
              <figcaption className="mt-3 text-center text-sm text-white/70">
                {images[index].caption}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
