"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Search, Calendar, User, Tag, ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    slug: "solar-energy-kenya-2025-guide",
    title: "The Complete Guide to Solar Energy in Kenya (2025)",
    excerpt: "Everything you need to know about switching to solar power in Kenya, from costs to installation and government incentives.",
    content: "Solar energy is transforming Kenya's energy landscape. With abundant sunshine year-round, businesses and homeowners are increasingly turning to solar power to reduce electricity costs and ensure energy independence...",
    author: "John Kariuki",
    date: "March 15, 2025",
    readTime: "8 min read",
    category: "Solar Energy",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Solar", "Renewable Energy", "Kenya", "Energy Savings"],
  },
  {
    slug: "electrical-safety-tips-home",
    title: "10 Essential Electrical Safety Tips for Every Homeowner",
    excerpt: "Protect your family and property with these critical electrical safety guidelines every homeowner should know.",
    content: "Electrical safety should be a priority in every household. According to recent statistics, electrical faults account for a significant percentage of residential fires in Kenya. Here are ten essential tips...",
    author: "Grace Wanjiku",
    date: "March 10, 2025",
    readTime: "6 min read",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Safety", "Home", "Electrical Tips", "Fire Prevention"],
  },
  {
    slug: "industrial-automation-trends",
    title: "Industrial Automation Trends Transforming Kenya's Manufacturing",
    excerpt: "Discover how smart automation and IoT are revolutionizing manufacturing plants across Kenya.",
    content: "The Fourth Industrial Revolution is here, and Kenya's manufacturing sector is embracing automation like never before. From PLC-based control systems to IoT-enabled monitoring...",
    author: "Peter Omondi",
    date: "March 5, 2025",
    readTime: "10 min read",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Automation", "Industrial", "IoT", "Manufacturing"],
  },
  {
    slug: "smart-home-systems-nairobi",
    title: "Smart Home Systems: The Future of Living in Nairobi",
    excerpt: "From automated lighting to intelligent security, explore how smart home technology is reshaping Nairobi homes.",
    content: "Smart home technology is no longer a luxury — it's becoming a standard feature in modern Nairobi homes. With affordable IoT devices and reliable installation services...",
    author: "Sarah Nyambura",
    date: "February 28, 2025",
    readTime: "7 min read",
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Smart Home", "IoT", "Nairobi", "Home Automation"],
  },
  {
    slug: "energy-audit-benefits",
    title: "Why Your Business Needs an Energy Audit in 2025",
    excerpt: "Learn how a professional energy audit can reduce your electricity bills by up to 40%.",
    content: "With rising electricity costs in Kenya, businesses are seeking ways to optimize their energy consumption. A professional energy audit is the first step toward significant savings...",
    author: "John Kariuki",
    date: "February 20, 2025",
    readTime: "5 min read",
    category: "Energy",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Energy Audit", "Business", "Cost Savings", "Efficiency"],
  },
  {
    slug: "commercial-electrical-installation",
    title: "Commercial Electrical Installation: A Complete Project Guide",
    excerpt: "A step-by-step guide to planning and executing commercial electrical projects in Kenya.",
    content: "Commercial electrical installations require careful planning, compliance with regulations, and professional execution. Whether you're building a new office or retrofitting an existing space...",
    author: "Grace Wanjiku",
    date: "February 15, 2025",
    readTime: "9 min read",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Commercial", "Installation", "Project Management", "Compliance"],
  },
];

const categories = ["All", "Solar Energy", "Safety", "Industrial", "Smart Home", "Energy", "Commercial"];

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
          <h1 className="heading-lg text-[var(--color-primary)]">SunSea Blog</h1>
          <p className="text-[var(--color-muted)] mt-2 text-lg">
            Insights, guides, and news from Kenya&apos;s trusted electrical engineers.
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
