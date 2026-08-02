"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  X, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight,
  Filter,
  Grid,
  LayoutGrid
} from "lucide-react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "./data";

// Utility function
function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// PageHero Component - Consistent size
function PageHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-hero-bg)] border-b border-[var(--color-nav-border)]">
      <div className="absolute inset-0 hero-pattern pointer-events-none" />
      <div className="container-custom relative z-10 pt-28 md:pt-36 pb-14 md:pb-20 text-center max-w-3xl mx-auto">
        <span className="badge badge-accent">Blog</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-hero-text)] leading-tight mt-2">
          Construction Industry Insights
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-hero-muted)] mt-4">
          Stay informed with the latest news, trends, and expert advice from the construction industry.
        </p>
      </div>
    </section>
  );
}

// Blog Card Component
function BlogCard({ post, featured = false }: { post: any; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className={`card overflow-hidden hover-lift transition-all duration-300 ${featured ? 'md:flex' : ''}`}>
        <div className={`relative overflow-hidden ${featured ? 'md:w-2/5 flex-shrink-0' : 'aspect-[16/9]'}`}>
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={featured ? 600 : 450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {post.featured && (
            <span className="absolute top-3 left-3 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white shadow-lg">
              Featured
            </span>
          )}
        </div>
        <div className={`p-6 ${featured ? 'flex-1 flex flex-col justify-center' : ''}`}>
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-2 flex-wrap">
            <span className="badge badge-accent text-[10px]">{post.category}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
          <h3 className={`font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
            {post.title}
          </h3>
          <p className="text-[var(--color-muted)] mt-2 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-[var(--color-muted)]">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>
          <div className="mt-4 flex items-center text-[var(--color-accent)] font-semibold text-sm group-hover:gap-1 transition-all">
            Read More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// CTASection Component
function CTASection() {
  return (
    <section className="section-padding bg-[var(--color-cta-bg)] text-white">
      <div className="container-custom text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with Our Blog</h2>
          <p className="text-white/80 text-lg mb-8">
            Subscribe to our newsletter and never miss an update from the construction industry.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#contact" className="btn-accent text-base py-3.5 px-8">
              Subscribe Now
            </Link>
            <Link href="/" className="inline-flex items-center px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Blog Page
export default function BlogPage() {
  const [category, setCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let posts = category === "All" ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === category);
    
    if (q) {
      posts = posts.filter((post) => 
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    
    return posts;
  }, [category, searchQuery]);

  const clearFilters = (): void => {
    setCategory("All");
    setSearchQuery("");
  };

  const featuredPost = BLOG_POSTS.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <>
      <PageHero />

      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-custom">
          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-all hover:border-[var(--color-accent)]/50 hover:text-[var(--color-foreground)] md:hidden"
                aria-label="Toggle filters"
              >
                <Filter className="size-4" />
                Categories
                {(category !== "All" || searchQuery) && (
                  <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
                    {(category !== "All" ? 1 : 0) + (searchQuery ? 1 : 0)}
                  </span>
                )}
              </button>
              
              <div className={cn(
                "flex flex-wrap gap-2 transition-all duration-300",
                showFilters ? "max-h-96 opacity-100" : "max-h-0 overflow-hidden opacity-0 md:max-h-96 md:opacity-100"
              )}>
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    aria-pressed={category === cat}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                      category === cat
                        ? "border-transparent bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                        : "border-[var(--color-nav-border)] bg-[var(--color-card-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-foreground)] hover:-translate-y-0.5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search Input */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  placeholder="Search blog..."
                  className="h-10 rounded-xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] pl-9 pr-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all w-full md:w-48"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-bg)] transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-1 rounded-xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-lg p-1.5 transition-all duration-300",
                    viewMode === "grid"
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-bg)]"
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-lg p-1.5 transition-all duration-300",
                    viewMode === "list"
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-bg)]"
                  )}
                  aria-label="List view"
                >
                  <LayoutGrid className="size-4" />
                </button>
              </div>

              {/* Results Count */}
              <span className="text-sm text-[var(--color-muted)] whitespace-nowrap">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              </span>

              {(category !== "All" || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-nav-toggle-bg)] px-2 py-1 rounded-lg"
                >
                  <X className="size-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && category === "All" && !searchQuery && (
            <div className="mb-12">
              <BlogCard post={featuredPost} featured />
            </div>
          )}

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-[var(--color-card-bg)] p-4 border border-[var(--color-nav-border)]">
                <Search className="size-8 text-[var(--color-muted)]/40" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-foreground)]">No posts found</h3>
              <p className="mt-2 text-[var(--color-muted)] max-w-sm">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary)]/90 hover:-translate-y-0.5 shadow-lg shadow-[var(--color-primary)]/20"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={category + searchQuery}
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                {regularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}