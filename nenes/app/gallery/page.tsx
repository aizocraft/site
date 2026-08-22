"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Expand, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  Columns
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Types
interface GalleryItem {
  id: string;
  src: string;
  title: string;
  caption?: string;
  width?: number;
  height?: number;
  isVideo?: boolean;
}

interface LightboxSlide {
  src: string;
  title: string;
  caption: string;
  isVideo?: boolean;
}

// Data using local images from public/gallery
const GALLERY: GalleryItem[] = [
  {
    id: "1",
    src: "/gallery/1000318630.jpg",
    title: "Construction Project 1",
    caption: "Residential construction progress",
  },
  {
    id: "2",
    src: "/gallery/1000318635.jpg",
    title: "Construction Project 2",
    caption: "Building foundation work",
  },
  {
    id: "3",
    src: "/gallery/1000318638.jpg",
    title: "Construction Project 3",
    caption: "Structural framework",
  },
  {
    id: "4",
    src: "/gallery/1000318641.jpg",
    title: "Construction Project 4",
    caption: "Wall construction",
  },
  {
    id: "5",
    src: "/gallery/1000318643.jpg",
    title: "Construction Project 5",
    caption: "Roof installation",
  },
  {
    id: "6",
    src: "/gallery/1000318647.jpg",
    title: "Construction Project 6",
    caption: "Interior finishing",
  },
  {
    id: "7",
    src: "/gallery/1000318649.jpg",
    title: "Construction Project 7",
    caption: "Exterior cladding",
  },
  {
    id: "8",
    src: "/gallery/1000318653.jpg",
    title: "Construction Project 8",
    caption: "Building facade",
  },
  {
    id: "9",
    src: "/gallery/1000318656.jpg",
    title: "Construction Project 9",
    caption: "Site development",
  },
  {
    id: "10",
    src: "/gallery/1000318657.jpg",
    title: "Construction Project 10",
    caption: "Structural steel work",
  },
  {
    id: "11",
    src: "/gallery/1000318662.jpg",
    title: "Construction Project 11",
    caption: "Concrete pouring",
  },
  {
    id: "12",
    src: "/gallery/1000318663.jpg",
    title: "Construction Project 12",
    caption: "Masonry work",
  },
  {
    id: "13",
    src: "/gallery/1000318668.jpg",
    title: "Construction Project 13",
    caption: "Plumbing installation",
  },
  {
    id: "14",
    src: "/gallery/1000318671.jpg",
    title: "Construction Project 14",
    caption: "Electrical wiring",
  },
  {
    id: "15",
    src: "/gallery/1000318674.jpg",
    title: "Construction Project 15",
    caption: "Ceiling installation",
  },
  {
    id: "16",
    src: "/gallery/1000318677.jpg",
    title: "Construction Project 16",
    caption: "Flooring work",
  },
  {
    id: "17",
    src: "/gallery/1000318680.jpg",
    title: "Construction Project 17",
    caption: "Painting and decoration",
  },
  {
    id: "18",
    src: "/gallery/1000318683.jpg",
    title: "Construction Project 18",
    caption: "Landscaping",
  },
  {
    id: "19",
    src: "/gallery/1000318686.jpg",
    title: "Construction Project 19",
    caption: "Final inspection",
  },
  {
    id: "20",
    src: "/gallery/1000318689.mp4",
    title: "Construction Video",
    caption: "Project walkthrough video",
    isVideo: true,
  },
  {
    id: "21",
    src: "/gallery/1000318691.jpg",
    title: "Construction Project 20",
    caption: "Completed project",
  },
  {
    id: "22",
    src: "/gallery/1000318693.jpg",
    title: "Construction Project 21",
    caption: "Project handover",
  },
    {
    id: "23",
    src: "/gallery/IMG20250725173839.jpg",
    title: "Construction",
    caption: "Early morning site overview showing foundation work",
  },
  {
    id: "24",
    src: "/gallery/IMG20250729174007.jpg",
    title: "Construction",
    caption: "Steel frame installation in progress",
  },
  {
    id: "25",
    src: "/gallery/IMG20250801074653.jpg",
    title: "Construction",
    caption: "Concrete pouring for the ground floor slab",
  },
  {
    id: "26",
    src: "/gallery/IMG20250801173643.jpg",
    title: "Construction",
    caption: "Evening progress shot showing wall construction",
  },
  {
    id: "27",
    src: "/gallery/IMG20260113080520.jpg",
    title: "Construction",
    caption: "Residential housing development progress",
  },
  {
    id: "28",
    src: "/gallery/IMG20260205140522.jpg",
    title: "Construction",
    caption: "Commercial building structural work",
  },
  {
    id: "29",
    src: "/gallery/IMG20260227084608.jpg",
    title: "Construction",
    caption: "Site preparation and excavation work",
  },
  {
    id: "30",
    src: "/gallery/IMG20260614082111.jpg",
    title: "Construction",
    caption: "Completed construction project - final inspection",
  },
];

// Helper
function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Modern Lightbox Component with Touch Support
function Lightbox({
  slides,
  index,
  onClose,
}: {
  slides: LightboxSlide[];
  index: number | null;
  onClose: () => void;
}) {
  const [localIndex, setLocalIndex] = useState(index ?? 0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (index !== null && index !== localIndex) {
      setLocalIndex(index);
      setIsZoomed(false);
    }
  }, [index, localIndex]);

  if (index === null || index < 0 || index >= slides.length) return null;

  const current = slides[localIndex];

  const goTo = (delta: number) => {
    setLocalIndex((prev) => (prev + delta + slides.length) % slides.length);
    setIsZoomed(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "f" || e.key === "F") setIsZoomed(!isZoomed);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, onClose, isZoomed]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) goTo(1);
      else goTo(-1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 30) goTo(1);
    else if (e.deltaY < -30) goTo(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div
        ref={containerRef}
        className="relative max-h-[90vh] max-w-7xl w-full overflow-hidden rounded-2xl bg-black/90"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div 
          className={`relative w-full h-[70vh] transition-transform duration-300 ${
            !current.isVideo && isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => {
            if (!current.isVideo) {
              setIsZoomed(!isZoomed);
            }
          }}
        >
          {current.isVideo ? (
            <video
              ref={videoRef}
              src={current.src}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <Image
              src={current.src}
              alt={current.title}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 90vw, 1200px"
              priority
              quality={100}
            />
          )}
        </div>

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
              {localIndex + 1} / {slides.length}
            </span>
            {current.isVideo && (
              <span className="rounded-full bg-red-500/80 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white">
                Video
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!current.isVideo && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="rounded-full bg-black/50 backdrop-blur-sm p-2 text-white transition-colors hover:bg-black/70"
                aria-label="Toggle zoom"
              >
                {isZoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full bg-black/50 backdrop-blur-sm p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Close lightbox"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(-1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition-all hover:bg-black/70 hover:scale-110"
              aria-label="Previous image"
            >
              <ArrowLeft className="size-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition-all hover:bg-black/70 hover:scale-110"
              aria-label="Next image"
            >
              <ArrowRight className="size-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white">{current.title}</h3>
          {current.caption && (
            <p className="text-sm text-white/80 mt-1">{current.caption}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
            <span>Use arrow keys to navigate</span>
            <span className="w-px h-4 bg-white/20" />
            {!current.isVideo && (
              <>
                <span>Press F to toggle zoom</span>
                <span className="w-px h-4 bg-white/20" />
              </>
            )}
            <span>Swipe to change</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Gallery Page
export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GALLERY;
    return GALLERY.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.caption && item.caption.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const clearSearch = () => setSearchQuery("");

  // Generate masonry heights based on image index for organic feel
  const getMasonryHeight = (index: number) => {
    // Create varied heights that flow naturally
    const patterns = [
      "row-span-2",      // tall
      "row-span-1",      // short
      "row-span-2",      // tall
      "row-span-1",      // short
      "row-span-3",      // extra tall
      "row-span-1",      // short
      "row-span-2",      // tall
      "row-span-2",      // tall
      "row-span-1",      // short
      "row-span-3",      // extra tall
      "row-span-1",      // short
      "row-span-2",      // tall
      "row-span-2",      // tall
      "row-span-1",      // short
      "row-span-3",      // extra tall
      "row-span-1",      // short
      "row-span-2",      // tall
      "row-span-2",      // tall
      "row-span-1",      // short
      "row-span-3",      // extra tall (video gets extra height)
      "row-span-1",      // short
      "row-span-2",      // tall
    ];
    return patterns[index % patterns.length];
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-hero-bg)] border-b border-[var(--color-nav-border)]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container-custom relative z-10 pt-20 md:pt-24 pb-8 md:pb-10">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-3">
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">
              Home
            </Link>
            <span className="text-[var(--color-muted)]/40">/</span>
            <span className="text-[var(--color-foreground)]">Gallery</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-hero-text)] leading-tight mt-2">
            Every course, joint and finish
          </h1>

        </div>
      </section>

      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-custom">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gallery..."
                className="h-11 w-full rounded-xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] pl-10 pr-10 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex gap-1 rounded-xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] p-1">
                <button
                  onClick={() => setViewMode("masonry")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 flex items-center gap-1.5",
                    viewMode === "masonry"
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-bg)]"
                  )}
                  aria-label="Masonry view"
                >
                  <Columns className="size-3.5" />
                  <span className="hidden sm:inline">Masonry</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 flex items-center gap-1.5",
                    viewMode === "grid"
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-bg)]"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="size-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
              <span className="text-sm text-[var(--color-muted)] whitespace-nowrap">
                {filteredItems.length} image{filteredItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-[var(--color-card-bg)] p-4 border border-[var(--color-nav-border)]">
                <Search className="size-8 text-[var(--color-muted)]/40" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-foreground)]">No images found</h3>
              <p className="mt-2 text-[var(--color-muted)] max-w-sm">
                Try adjusting your search to find what you&apos;re looking for.
              </p>
              <button
                onClick={clearSearch}
                className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary)]/90"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery + viewMode}
                className={cn(
                  "grid gap-4",
                  viewMode === "masonry" 
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                )}
              >
                {filteredItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Open ${item.title}`}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] text-left transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 hover:-translate-y-1",
                      viewMode === "masonry" 
                        ? getMasonryHeight(i)
                        : "aspect-[4/3]"
                    )}
                  >
                    {item.isVideo ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.src}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          loop
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/20">
                          <div className="rounded-full bg-white/90 p-4 shadow-lg transition-transform group-hover:scale-110">
                            <svg className="size-8 text-black/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 ring-2 ring-[var(--color-accent)]/50 rounded-2xl" />
                    </div>
                    
                    <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 shadow-lg">
                      <Expand className="size-4 text-[var(--color-foreground)]" />
                    </span>
                    
                    {item.isVideo && (
                      <span className="absolute left-3 top-3 rounded-full bg-red-500/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white">
                        Video
                      </span>
                    )}
                    
                    <span className="absolute inset-x-0 bottom-0 translate-y-6 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="block font-semibold text-white text-sm drop-shadow-lg">
                        {item.title}
                      </span>
                      {item.caption && (
                        <span className="mt-0.5 block text-xs text-white/80 drop-shadow-lg">
                          {item.caption}
                        </span>
                      )}
                    </span>
                    
                    <span className="absolute left-3 top-3 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/80 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      {i + 1}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            slides={filteredItems.map((i) => ({
              src: i.src,
              title: i.title,
              caption: i.caption || "",
              isVideo: i.isVideo || false,
            }))}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
          />
        )}
      </AnimatePresence>

      <section className="section-padding bg-[var(--color-cta-bg)] text-white">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Project?</h2>
            <p className="text-white/80 text-lg mb-8">
              Let&apos;s discuss your vision and turn it into reality with our expert construction services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#contact" className="btn-accent text-base py-3.5 px-8">
                Request a Quote
              </Link>
              <Link
                href="/#services"
                className="inline-flex items-center px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}