"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface ImageZoomModalProps {
  images: string[];
  selectedIndex: number | null;
  onClose: () => void;
  title?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 800 : -800,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 800 : -800,
    opacity: 0,
    scale: 0.9,
    zIndex: 0,
  }),
};

export default function ImageZoomModal({
  images,
  selectedIndex,
  onClose,
  title = "Artwork",
}: ImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(selectedIndex);
  const [direction, setDirection] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Touch tracking refs for pinch & double-tap
  const lastTouchDistanceRef = useRef<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imagePosRef = useRef({ x: 0, y: 0 });

  const [prevSelectedIndex, setPrevSelectedIndex] = useState(selectedIndex);

  if (selectedIndex !== prevSelectedIndex) {
    setPrevSelectedIndex(selectedIndex);
    setCurrentIndex(selectedIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmall = window.innerWidth <= 768;
      setIsMobile(isSmall || hasTouch);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fade out hint after 3s
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    imagePosRef.current = { x: 0, y: 0 };
  }, []);

  const nextImage = useCallback(() => {
    if (currentIndex === null || images.length === 0) return;
    resetZoom();
    setDirection(1);
    setCurrentIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  }, [currentIndex, images.length, resetZoom]);

  const prevImage = useCallback(() => {
    if (currentIndex === null || images.length === 0) return;
    resetZoom();
    setDirection(-1);
    setCurrentIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  }, [currentIndex, images.length, resetZoom]);

  // Keyboard navigation on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(4, s + 0.5));
      }
      if (e.key === "-") {
        setScale((s) => {
          const next = Math.max(1, s - 0.5);
          if (next === 1) setPosition({ x: 0, y: 0 });
          return next;
        });
      }
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, nextImage, prevImage, onClose, resetZoom]);

  // Mobile zoom step buttons
  const zoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = prev < 1.5 ? 1.5 : prev < 2 ? 2 : prev < 3 ? 3 : 4;
      return next;
    });
  };

  const zoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => {
      const next = prev > 3 ? 3 : prev > 2 ? 2 : prev > 1.5 ? 1.5 : 1;
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
        imagePosRef.current = { x: 0, y: 0 };
      }
      return next;
    });
  };

  // Double tap handler for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2-finger pinch initiated
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistanceRef.current = dist;
    } else if (e.touches.length === 1) {
      // Check for double tap
      const now = Date.now();
      if (now - lastTapTimeRef.current < 300) {
        // Double tap triggered!
        if (scale > 1) {
          resetZoom();
        } else {
          setScale(2.5);
        }
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
      }

      // Drag start if scaled
      if (scale > 1) {
        isDraggingRef.current = true;
        dragStartRef.current = {
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistanceRef.current !== null) {
      // Pinch to zoom
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / lastTouchDistanceRef.current;
      setScale((prev) => {
        const newScale = Math.min(4, Math.max(1, prev * ratio));
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
          imagePosRef.current = { x: 0, y: 0 };
        }
        return newScale;
      });
      lastTouchDistanceRef.current = currentDist;
    } else if (e.touches.length === 1 && scale > 1 && isDraggingRef.current) {
      // Pan zoomed image
      const newX = e.touches[0].clientX - dragStartRef.current.x;
      const newY = e.touches[0].clientY - dragStartRef.current.y;
      const maxPanX = (window.innerWidth * (scale - 1)) / 2;
      const maxPanY = (window.innerHeight * (scale - 1)) / 2;
      const clampedX = Math.max(-maxPanX, Math.min(maxPanX, newX));
      const clampedY = Math.max(-maxPanY, Math.min(maxPanY, newY));
      setPosition({ x: clampedX, y: clampedY });
      imagePosRef.current = { x: clampedX, y: clampedY };
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistanceRef.current = null;
    isDraggingRef.current = false;
  };

  if (currentIndex === null || !images[currentIndex]) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 select-none overflow-hidden touch-none"
        style={{ transform: "translateZ(0)" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Backdrop click to close (only if not zoomed) */}
        <div
          className="absolute inset-0 z-[121]"
          onClick={() => {
            if (scale === 1) onClose();
          }}
        />

        {/* Top Header Controls Bar */}
        <div className="absolute top-4 inset-x-4 md:top-6 md:inset-x-8 z-[140] flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
            <span className="text-pink-500 font-bold text-xs uppercase tracking-widest">
              {title}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-gray-300 font-mono text-xs">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close image modal"
            className="p-3 bg-black/60 hover:bg-pink-500/30 text-white rounded-full transition-all border border-white/15 hover:border-pink-500/50 backdrop-blur-md pointer-events-auto active:scale-95 shadow-xl"
          >
            <X className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>

        {/* Desktop Side Navigation Click Regions (Hidden on mobile) */}
        <div
          className="absolute inset-y-0 left-0 w-[20%] z-[125] cursor-pointer group hidden md:block"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
        >
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div
          className="absolute inset-y-0 right-0 w-[20%] z-[125] cursor-pointer group hidden md:block"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
        >
          <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Desktop Arrow Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          aria-label="Previous Image"
          className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 p-4 md:p-5 bg-black/60 hover:bg-pink-500/20 text-white rounded-full transition-all border border-white/10 hover:border-pink-500/50 z-[130] group hidden md:flex items-center justify-center backdrop-blur-md shadow-2xl"
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          aria-label="Next Image"
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 p-4 md:p-5 bg-black/60 hover:bg-pink-500/20 text-white rounded-full transition-all border border-white/10 hover:border-pink-500/50 z-[130] group hidden md:flex items-center justify-center backdrop-blur-md shadow-2xl"
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Main Image Container */}
        <div className="relative w-[92vw] h-[78vh] md:w-[88vw] md:h-[82vh] flex items-center justify-center z-[122] pointer-events-auto">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className={`absolute inset-0 flex items-center justify-center ${
                scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
              }`}
              // Drag horizontally to change images only if not zoomed
              drag={scale === 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_e, { offset, velocity }) => {
                if (scale !== 1) return;
                const swipe = offset.x;
                const swipePower = Math.abs(offset.x) * velocity.x;
                if (swipe < -60 || swipePower < -40000) {
                  nextImage();
                } else if (swipe > 60 || swipePower > 40000) {
                  prevImage();
                }
              }}
            >
              <motion.div
                animate={{
                  scale,
                  x: position.x,
                  y: position.y,
                }}
                transition={{
                  scale: { type: "spring", stiffness: 300, damping: 25 },
                  x: { type: "spring", stiffness: 350, damping: 30 },
                  y: { type: "spring", stiffness: 350, damping: 30 },
                }}
                className="relative max-w-full max-h-full flex items-center justify-center will-change-transform"
              >
                <img
                  src={images[currentIndex]}
                  alt={`${title} view ${currentIndex + 1}`}
                  draggable={false}
                  className="max-w-[92vw] max-h-[78vh] md:max-w-[85vw] md:max-h-[82vh] object-contain rounded-2xl md:rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-white/10 pointer-events-auto"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Device Zoom Controls Toolbar (Prominently displayed for mobile / touch devices) */}
        {isMobile && (
          <div className="absolute bottom-6 inset-x-0 z-[140] flex flex-col items-center gap-3 pointer-events-none px-4">
            {/* Animated Hint for Mobile Users */}
            <AnimatePresence>
              {showHint && scale === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-500/40 text-[11px] text-pink-300 font-medium shadow-lg"
                >
                  💡 Double tap or pinch to zoom
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Zoom Action Toolbar */}
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/15 px-3 py-2 rounded-full shadow-2xl pointer-events-auto">
              <button
                onClick={zoomOut}
                disabled={scale <= 1}
                aria-label="Zoom Out"
                className={`p-2.5 rounded-full text-white transition-all active:scale-90 ${
                  scale <= 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-white/15 bg-white/5 active:bg-pink-500"
                }`}
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <div className="px-3 py-1 bg-white/10 rounded-full font-mono text-xs font-bold text-pink-400 min-w-[56px] text-center border border-white/10">
                {Math.round(scale * 100)}%
              </div>

              <button
                onClick={zoomIn}
                disabled={scale >= 4}
                aria-label="Zoom In"
                className={`p-2.5 rounded-full text-white transition-all active:scale-90 ${
                  scale >= 4
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-white/15 bg-white/5 active:bg-pink-500"
                }`}
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {scale > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                  }}
                  aria-label="Reset Zoom"
                  className="p-2.5 ml-1 rounded-full text-yellow-400 bg-white/10 hover:bg-white/20 active:scale-90 transition-all border border-yellow-400/30"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile swipe dots / progress */}
            <div className="flex items-center gap-1.5 pt-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-5 bg-pink-500" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Desktop bottom pagination counter */}
        {!isMobile && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2.5 bg-black/70 backdrop-blur-md rounded-full border border-white/10 shadow-2xl z-[130]">
            <span className="text-pink-500 font-bold text-lg tracking-tight">
              {currentIndex + 1}
            </span>
            <span className="text-white/30 text-lg">/</span>
            <span className="text-gray-400 font-medium text-sm">
              {images.length}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
