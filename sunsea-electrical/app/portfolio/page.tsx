"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Search, MapPin } from "lucide-react";

const allProjects = [
  {
    slug: "kcb-tower-backup-system",
    title: "KCB Tower Backup System",
    location: "Nairobi",
    category: "Commercial",
    description: "Complete backup power system installation for Kenya's tallest building, ensuring uninterrupted operations.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "mombasa-solar-farm",
    title: "Mombasa Solar Farm",
    location: "Mombasa",
    category: "Solar",
    description: "Large-scale solar farm providing clean energy to over 5,000 homes in the coastal region.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "eldoret-industrial-plant",
    title: "Eldoret Industrial Plant",
    location: "Eldoret",
    category: "Industrial",
    description: "Complete electrical infrastructure for a major manufacturing plant, including automation systems.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "nairobi-hospital-backup-power",
    title: "Nairobi Hospital Backup Power",
    location: "Nairobi",
    category: "Healthcare",
    description: "Critical backup power systems for a leading hospital, ensuring life-saving equipment always stays on.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "kisumu-mall-electrical-systems",
    title: "Kisumu Mall Electrical Systems",
    location: "Kisumu",
    category: "Commercial",
    description: "Full electrical installation for a modern shopping mall, including lighting, HVAC, and security systems.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "nakuru-residential-solar",
    title: "Nakuru Residential Solar",
    location: "Nakuru",
    category: "Residential",
    description: "Solar panel installation for a luxury residential estate, reducing energy costs by 60%.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
];

const categories = ["All", "Commercial", "Industrial", "Residential", "Solar", "Healthcare"];

export default function PortfolioPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = allProjects.filter((project) => {
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="section-padding section-alt min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="heading-lg text-[var(--color-primary)]">Our Portfolio</h1>
          <p className="text-[var(--color-muted)] mt-2 text-lg">
            Explore our complete collection of electrical projects across Kenya.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-[var(--color-card-border)]">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-soft)]"
                    : "bg-[var(--color-card-bg)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] border border-[var(--color-card-border)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.slug}
                className="card overflow-hidden group hover-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-accent text-[10px]">{project.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location}
                  </div>
                  <p className="text-sm text-[var(--color-muted)] mt-3 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                  <Link
                    href={`/${project.slug}`}
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
            <Search className="w-16 h-16 text-[var(--color-muted)] opacity-40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">No projects found</h3>
            <p className="text-[var(--color-muted)] mt-2">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
