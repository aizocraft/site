"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  ChevronDown,
  Filter
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../components/Reveal";

// Types
interface GalleryItem {
  id: string;
  src: string;
  title: string;
  caption?: string;
  category: string;
  width?: number;
  height?: number;
}

interface LightboxSlide {
  src: string;
  title: string;
  caption: string;
}

// Data
const GALLERY: GalleryItem[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "KCB Tower Backup System",
    caption: "Complete backup power system for Kenya's tallest building",
    category: "Commercial",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Mombasa Solar Farm",
    caption: "Large-scale solar farm providing clean energy to 5,000+ homes",
    category: "Solar",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Eldoret Industrial Plant",
    caption: "Complete electrical infrastructure for major manufacturing plant",
    category: "Industrial",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Nairobi Hospital Backup Power",
    caption: "Critical backup power systems for a leading hospital",
    category: "Healthcare",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Kisumu Mall Electrical Systems",
    caption: "Full electrical installation for a modern shopping mall",
    category: "Commercial",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Nakuru Residential Solar",
    caption: "Solar panel installation for a luxury residential estate",
    category: "Residential",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "LED Lighting Retrofit",
    caption: "Energy-efficient LED lighting upgrade for commercial buildings",
    category: "Lighting",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Industrial Motor Control",
    caption: "Motor control center installation for manufacturing facility",
    category: "Industrial",
  },
  {
    id: "9",
    src: "https://images.unsplash.com/photo-1497366811357-4f8f0f7c6f0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Smart Building Automation",
    caption: "IoT-enabled building automation system for modern office",
    category: "Smart Building",
  },
  {
    id: "10",
    src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Solar Water Heating",
    caption: "Commercial solar water heating system installation",
    category: "Solar",
  },
  {
    id: "11",
    src: "https://images.unsplash.com/photo-1497366811357-4f8f0f7c6f0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Generator Synchronization",
    caption: "Advanced generator synchronization system for backup power",
    category: "Commercial",
  },
  {
    id: "12",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Switchgear Installation",
    caption: "MV/LV switchgear installation for industrial facility",
    category: "Industrial",
  },
];

const categories = ["All", "Commercial", "Solar", "Industrial", "Healthcare", "Residential", "Lighting", "Smart Building"];

// Helper
function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Lightbox Component
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

  const goTo = useCallback(
    (delta: number) => {
      setLocalIndex((prev) => (prev + delta + slides.length) % slides.length);
      setIsZoomed(false);
    },
    [slides.length]
  );

  useEffect(() => {
    if (index !== null && index !== localIndex) {
      setLocalIndex(index);
      setIsZoomed(false);
    }
  }, [index, localIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "f" || e.key === "F") setIsZoomed((z) => !z);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goTo]);

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

  if (index === null || index < 0 || index >= slides.length) return null;

  const current = slides[localIndex];

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
        className="relative max-h-[90vh] max-w-7xl w-full overflow-hidden rounded-2xl bg-black/90"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
              className="rounded-full bg-black/50 backdrop-blur-sm p-2 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 active:scale-95"
              aria-label="Toggle zoom"
            >
              {isZoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-black/50 backdrop-blur-sm p-2 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 active:scale-95"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <ArrowLeft className="size-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-3 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 active:scale-95"
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let items = GALLERY;
    
    if (activeCategory !== "All") {
      items = items.filter((item) => item.category === activeCategory);
    }
    
    if (q) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.caption && item.caption.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      );
    }
    
    return items;
  }, [searchQuery, activeCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

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
      {/* Hero - Reduced height for better mobile experience */}
      <section className="relative overflow-hidden bg-[#00255e] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.05) 80px, rgba(255,255,255,0.05) 81px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.05) 80px, rgba(255,255,255,0.05) 81px)
            `
          }} />
        </div>
        <div className="container-custom relative z-10 pt-20 md:pt-28 pb-10 md:pb-16">
          <Reveal direction="right">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
              <Link href="/" className="hover:text-[#f9ad07] transition-colors duration-300">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white">Gallery</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mt-2">
              Our Electrical <span className="text-[#f9ad07]">Projects</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 mt-3 max-w-2xl">
              Explore our portfolio of electrical installations, solar solutions, and industrial projects across Kenya.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-page-alt">
        <div className="container-custom">
          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gallery..."
                  className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#f9ad07] focus:outline-none focus:ring-2 focus:ring-[#f9ad07]/20 transition-all duration-300 hover:border-[#f9ad07]/50"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-[#f9ad07] transition-all duration-300 hover:scale-[1.02] active:scale-95 md:hidden"
              >
                <Filter className="size-4" />
                Categories
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              {/* Category Filters - Desktop */}
              <div className="hidden md:flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.05] active:scale-95 ${
                      activeCategory === cat
                        ? "bg-[#f9ad07] text-[#00255e] shadow-lg shadow-[#f9ad07]/30"
                        : "bg-white dark:bg-[#1a1f2e] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#f9ad07] hover:shadow-md"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Category Filters - Mobile Dropdown */}
              <div className={`md:hidden flex flex-wrap gap-2 transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-[#f9ad07] text-[#00255e] shadow-lg shadow-[#f9ad07]/30"
                        : "bg-white dark:bg-[#1a1f2e] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#f9ad07]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] p-1">
                  <button
                    onClick={() => setViewMode("masonry")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-[1.05] active:scale-95",
                      viewMode === "masonry"
                        ? "bg-[#f9ad07] text-[#00255e] shadow-lg shadow-[#f9ad07]/20"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    )}
                  >
                    Masonry
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-[1.05] active:scale-95",
                      viewMode === "grid"
                        ? "bg-[#f9ad07] text-[#00255e] shadow-lg shadow-[#f9ad07]/20"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    )}
                  >
                    Grid
                  </button>
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {filteredItems.length} image{filteredItems.length !== 1 ? "s" : ""}
                </span>

                {(activeCategory !== "All" || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-[#f9ad07] transition-all duration-300 hover:scale-[1.05] active:scale-95"
                  >
                    <X className="size-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-white dark:bg-[#1a1f2e] p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105">
                <Search className="size-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-[#00255e] dark:text-white">No images found</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#f9ad07] px-6 py-2.5 text-sm font-semibold text-[#00255e] transition-all duration-300 hover:bg-[#e09c00] hover:scale-[1.05] active:scale-95"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery + viewMode}
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
                      "group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-left transition-all duration-500 hover:shadow-2xl hover:shadow-[#f9ad07]/10 hover:border-[#f9ad07] hover:-translate-y-1",
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
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Border Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 ring-2 ring-[#f9ad07]/50 rounded-2xl" />
                    </div>
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 rounded-full bg-[#f9ad07] px-2.5 py-0.5 text-[10px] font-bold text-[#00255e] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                      {item.category}
                    </span>
                    
                    {/* Expand Icon */}
                    <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 dark:bg-[#1a1f2e]/90 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 scale-90">
                      <Expand className="size-4 text-[#00255e] dark:text-white" />
                    </span>
                    
                    {/* Info */}
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
      <section className="section-padding bg-[#00255e] text-white">
        <div className="container-custom text-center">
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
              <p className="text-white/80 text-base md:text-lg mb-8">
                Let's discuss your electrical engineering needs and bring your vision to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#contact" className="btn-accent text-base py-3.5 px-8 hover:scale-[1.05] active:scale-95 transition-all duration-300">
                  Request a Quote
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex items-center px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold hover:scale-[1.05] active:scale-95"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}