"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Search, Calendar, User, Tag, ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "./data";
import Reveal from "../components/Reveal";

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
        <Reveal>
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-[var(--color-muted)] hover:text-[#f9ad07] transition-all duration-300 hover:scale-[1.05] active:scale-95 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            <h1 className="heading-lg text-[#00255e] dark:text-[#f9ad07]">SunSea Blog</h1>
            <p className="text-[#008ad2] dark:text-gray-400 mt-2 text-lg">
              Insights, guides, and news from Kenya&apos;s trusted electrical engineers.
            </p>
          </div>
        </Reveal>

        {/* Search & Filter */}
        <Reveal delay={0.08}>
          <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-[var(--color-card-border)]">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 transition-all duration-300 hover:border-[#f9ad07]/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.05] active:scale-95 ${
                    activeCategory === category
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-soft)]"
                      : "bg-[var(--color-card-bg)] text-gray-600 dark:text-gray-400 hover:text-[#f9ad07] hover:border-[#f9ad07] border border-[var(--color-card-border)]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card overflow-hidden group hover-lift h-full flex flex-col transition-all duration-300 hover:border-[#f9ad07]"
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
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="badge badge-accent text-[10px]">{post.category}</span>
                      <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#00255e] dark:text-[#f9ad07] group-hover:text-[#f9ad07] transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#008ad2] dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-card-border)] mt-auto">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" />
                        {post.author}
                        <span className="mx-1">·</span>
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                      <span className="text-[#f9ad07] text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 opacity-40 mx-auto mb-4 transition-all duration-300 hover:scale-110" />
              <h3 className="text-xl font-bold text-[#00255e] dark:text-white">No articles found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}