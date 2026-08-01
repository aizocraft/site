"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Search, Calendar, User, Tag, ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    slug: "construction-cost-guide-kenya-2025",
    title: "The Complete Guide to Construction Costs in Kenya (2025)",
    excerpt: "Everything you need to know about building costs in Kenya, from materials to labor and permits.",
    content: "Building a home or commercial property in Kenya requires careful budgeting. Here's a comprehensive guide to construction costs in 2025...",
    author: "John Kariuki",
    date: "March 15, 2025",
    readTime: "8 min read",
    category: "Construction",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Construction Costs", "Building", "Kenya", "Budgeting"],
  },
  {
    slug: "essential-tips-choosing-contractor",
    title: "10 Essential Tips for Choosing the Right Contractor",
    excerpt: "Protect your investment with these critical guidelines for selecting a reliable construction contractor.",
    content: "Choosing the right contractor is the most important decision in any construction project. Here are ten essential tips...",
    author: "Grace Wanjiku",
    date: "March 10, 2025",
    readTime: "6 min read",
    category: "Advice",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Contractor", "Tips", "Construction", "Hiring"],
  },
  {
    slug: "green-building-trends-kenya",
    title: "Green Building Trends Transforming Kenya's Construction",
    excerpt: "Discover how sustainable building practices are revolutionizing construction across Kenya.",
    content: "Sustainable construction is no longer optional — it's becoming the standard. Here's how green building is transforming Kenya...",
    author: "Peter Omondi",
    date: "March 5, 2025",
    readTime: "10 min read",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1590584883493-8f1e2e375ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Green Building", "Sustainability", "Environment", "Construction"],
  },
  {
    slug: "modern-home-design-nairobi",
    title: "Modern Home Design Trends in Nairobi for 2025",
    excerpt: "From open-plan living to smart home integration, explore the latest in Nairobi home design.",
    content: "Nairobi's home design scene is evolving rapidly. Here are the top trends shaping modern homes in Kenya's capital...",
    author: "Sarah Nyambura",
    date: "February 28, 2025",
    readTime: "7 min read",
    category: "Design",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Home Design", "Nairobi", "Architecture", "Interior"],
  },
  {
    slug: "commercial-building-regulations",
    title: "Commercial Building Regulations in Kenya: A Guide",
    excerpt: "Navigate Kenya's building codes and regulations for commercial construction projects.",
    content: "Understanding building regulations is crucial for any commercial project. Here's what you need to know...",
    author: "John Kariuki",
    date: "February 20, 2025",
    readTime: "5 min read",
    category: "Regulations",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Regulations", "Commercial", "Compliance", "Building Codes"],
  },
  {
    slug: "residential-construction-process",
    title: "Residential Construction: A Complete Step-by-Step Guide",
    excerpt: "A comprehensive guide to the residential construction process in Kenya, from foundation to handover.",
    content: "Building your dream home involves many stages. Here's a complete step-by-step guide to residential construction...",
    author: "Grace Wanjiku",
    date: "February 15, 2025",
    readTime: "9 min read",
    category: "Construction",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Residential", "Construction", "Home Building", "Guide"],
  },
];

const categories = ["All", "Construction", "Advice", "Sustainability", "Design", "Regulations"];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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
          <h1 className="heading-lg text-[var(--color-primary)]">Nenes Construction Blog</h1>
          <p className="text-[var(--color-muted)] mt-2 text-lg">
            Insights, guides, and news from Kenya&apos;s trusted builders.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-[var(--color-card-border)]">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search articles..."
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

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card overflow-hidden group hover-lift"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="badge badge-accent text-[10px]">{post.category}</span>
                    <span className="flex items-center text-xs text-[var(--color-muted)]">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-card-border)]">
                    <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                      <User className="w-3 h-3" />
                      {post.author}
                      <span className="mx-1">·</span>
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <span className="text-[var(--color-accent)] text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-[var(--color-muted)] opacity-40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">No articles found</h3>
            <p className="text-[var(--color-muted)] mt-2">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
