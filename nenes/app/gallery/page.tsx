"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Expand, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  ChevronDown
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
}

interface LightboxSlide {
  src: string;
  title: string;
  caption: string;
}

// Data with varied aspect ratios for creative grid
const GALLERY: GalleryItem[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Greenpark Residential Estate",
    caption: "Luxury residential estate with modern architecture",
    width: 800,
    height: 600,
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Westside Commercial Tower",
    caption: "12-storey commercial landmark in Mombasa",
    width: 800,
    height: 900,
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Eldoret Industrial Warehouse",
    caption: "10,000 sqm industrial facility",
    width: 800,
    height: 500,
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Nairobi Hospital Extension",
    caption: "200-bed medical wing",
    width: 800,
    height: 700,
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Nakuru Affordable Housing",
    caption: "200-unit community development",
    width: 800,
    height: 550,
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Kisumu Shopping Mall",
    caption: "Modern retail and entertainment center",
    width: 800,
    height: 800,
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Natural Stone Cladding",
    caption: "Premium stone wall finishing",
    width: 800,
    height: 650,
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Driveway Paving",
    caption: "Premium driveway installation",
    width: 800,
    height: 450,
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Construction Site Progress",
    caption: "Steel framework and concrete works",
    width: 800,
    height: 750,
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Sustainable Building Design",
    caption: "Green building with solar integration",
    width: 800,
    height: 600,
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Modern Residential Interior",
    caption: "Open plan living with premium finishes",
    width: 800,
    height: 850,
  },
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Commercial Building Facade",
    caption: "Glass curtain wall installation",
    width: 800,
    height: 500,
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
  };

  // Keyboard navigation
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

  // Touch handlers for swipe
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

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) goTo(1);
      else goTo(-1);
    }
  };

  // Mouse wheel navigation
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
        {/* Image Container */}
        <div 
          className={`relative w-full h-[70vh] transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={current.src}
            alt={current.title}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 90vw, 1200px"
            priority
            quality={100}
          />
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
              {localIndex + 1} / {slides.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
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
            <button
              onClick={onClose}
              className="rounded-full bg-black/50 backdrop-blur-sm p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Close lightbox"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
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

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white">{current.title}</h3>
          {current.caption && (
            <p className="text-sm text-white/80 mt-1">{current.caption}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
            <span>Use arrow keys to navigate</span>
            <span className="w-px h-4 bg-white/20" />
            <span>Press F to toggle zoom</span>
            <span className="w-px h-4 bg-white/20" />
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

  // Creative masonry grid with varied heights
  const getItemHeight = (index: number) => {
    const heights = [
      "h-64 md:h-72",
      "h-72 md:h-80",
      "h-56 md:h-64",
      "h-80 md:h-96",
      "h-60 md:h-68",
      "h-76 md:h-88",
      "h-68 md:h-76",
      "h-52 md:h-60",
    ];
    return heights[index % heights.length];
  };

  return (
    <>
      {/* Hero - Consistent Size */}
      <section className="relative overflow-hidden bg-[var(--color-hero-bg)] border-b border-[var(--color-nav-border)]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container-custom relative z-10 pt-28 md:pt-36 pb-14 md:pb-20">
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
          <p className="text-lg md:text-xl text-[var(--color-hero-muted)] mt-4 max-w-2xl">
            A visual journey through our construction excellence
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-custom">
          {/* Search and Controls */}
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
              {/* View Mode Toggle */}
              <div className="flex gap-1 rounded-xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] p-1">
                <button
                  onClick={() => setViewMode("masonry")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300",
                    viewMode === "masonry"
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-bg)]"
                  )}
                >
                  Masonry
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300",
                    viewMode === "grid"
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-bg)]"
                  )}
                >
                  Grid
                </button>
              </div>
              <span className="text-sm text-[var(--color-muted)] whitespace-nowrap">
                {filteredItems.length} image{filteredItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Creative Grid */}
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
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-auto"
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
                      viewMode === "masonry" ? getItemHeight(i) : "aspect-[4/3]"
                    )}
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Decorative Border Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 ring-2 ring-[var(--color-accent)]/50 rounded-2xl" />
                    </div>
                    
                    {/* Expand Icon */}
                    <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 shadow-lg">
                      <Expand className="size-4 text-[var(--color-foreground)]" />
                    </span>
                    
                    {/* Info - Slide up */}
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
                    
                    {/* Category Badge - Top Left */}
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

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            slides={filteredItems.map((i) => ({
              src: i.src,
              title: i.title,
              caption: i.caption || "",
            }))}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* CTA */}
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