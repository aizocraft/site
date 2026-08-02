"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Grid, 
  LayoutGrid,
  Filter,
  X
} from "lucide-react";
import { PORTFOLIO_PROJECTS } from "./data";

const categories = ["All", "Residential", "Commercial", "Industrial", "Healthcare"];

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PORTFOLIO_PROJECTS.filter((project) => {
      const matchesCategory = activeCategory === "All" || project.category === activeCategory;
      const matchesSearch = !q || 
        project.title.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.category.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section - Consistent size */}
      <section className="relative overflow-hidden bg-[var(--color-hero-bg)] border-b border-[var(--color-nav-border)]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container-custom relative z-10 pt-28 md:pt-36 pb-14 md:pb-20">
          <div className="max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-hero-text)] leading-tight">
              Our Portfolio
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-hero-muted)] mt-4">
              Explore our completed projects across Kenya
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-6 bg-[var(--color-card-bg)] border-b border-[var(--color-nav-border)] sticky top-16 z-20 backdrop-blur-md bg-opacity-90">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial min-w-[200px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 h-11 rounded-xl w-full md:w-64"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-soft)]"
                        : "bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-accent)] border border-[var(--color-nav-border)]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {(searchQuery || activeCategory !== "All") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <span className="text-sm text-[var(--color-muted)] whitespace-nowrap">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-1 border border-[var(--color-nav-border)] rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                  aria-label="List view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredProjects.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredProjects.map((project) => (
                <div
                  key={project.slug}
                  className={`card overflow-hidden group hover-lift transition-all duration-300 ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                >
                  <div className={`${viewMode === "list" ? "md:w-80 flex-shrink-0" : ""} aspect-[4/3] overflow-hidden`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className={`p-6 flex flex-col ${
                    viewMode === "list" ? "flex-1" : ""
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-accent text-[10px]">{project.category}</span>
                      <span className="text-xs text-[var(--color-muted)]">{project.year}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] mt-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {project.location}
                    </div>
                    <p className={`text-sm text-[var(--color-muted)] mt-3 leading-relaxed ${
                      viewMode === "list" ? "line-clamp-3" : "line-clamp-2"
                    }`}>
                      {project.description}
                    </p>
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center mt-4 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors group/link"
                    >
                      View Details
                      <span className="ml-1.5 group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[var(--color-card-bg)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-nav-border)]">
                <Search className="w-10 h-10 text-[var(--color-muted)] opacity-40" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-foreground)]">No projects found</h3>
              <p className="text-[var(--color-muted)] mt-2 max-w-md mx-auto">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}