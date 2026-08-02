"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag, Clock, ArrowRight, Share2, Heart } from "lucide-react";
import { blogPosts } from "../data";
import Reveal from "../../components/Reveal";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Render inline markdown bold (**text** → <strong>)
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-b-${i}`} className="font-bold text-[#00255e] dark:text-[#f9ad07]">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

// Group consecutive list lines into proper <ul>/<ol> blocks
function renderContent(content: string) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    const { type, items } = currentList;
    const Tag = type === "ul" ? "ul" : "ol";
    blocks.push(
      <Tag
        key={`list-${blocks.length}`}
        className={`${type === "ul" ? "list-disc" : "list-decimal"} ml-5 mb-4 space-y-2`}
      >
        {items.map((item, j) => (
          <li
            key={`li-${j}`}
            className="text-gray-600 dark:text-gray-300 leading-relaxed pl-1 marker:text-[#f9ad07]"
          >
            {renderInline(item, `li-${blocks.length}-${j}`)}
          </li>
        ))}
      </Tag>
    );
    currentList = null;
  };

  lines.forEach((paragraph, i) => {
    if (paragraph.startsWith("- ")) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(paragraph.replace(/^- /, ""));
      return;
    }
    if (paragraph.match(/^\d+\. /)) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(paragraph.replace(/^\d+\. /, ""));
      return;
    }
    flushList();

    if (paragraph.startsWith("## ")) {
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="text-2xl font-bold text-[#00255e] dark:text-white mt-10 mb-4"
        >
          {renderInline(paragraph.replace("## ", ""), `h2-${i}`)}
        </h2>
      );
      return;
    }
    if (paragraph.startsWith("# ")) {
      blocks.push(
        <h1
          key={`h1-${i}`}
          className="text-3xl font-bold text-[#00255e] dark:text-white mt-10 mb-4"
        >
          {renderInline(paragraph.replace("# ", ""), `h1-${i}`)}
        </h1>
      );
      return;
    }
    if (paragraph.trim() === "") {
      blocks.push(<div key={`sp-${i}`} className="h-4" />);
      return;
    }
    blocks.push(
      <p key={`p-${i}`} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        {renderInline(paragraph, `p-${i}`)}
      </p>
    );
  });
  flushList();

  return blocks;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="section-padding section-alt min-h-screen">
      <div className="container-custom">
        {/* Back link - minimized hero */}
        <Reveal direction="right">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f9ad07] transition-all duration-300 hover:scale-[1.05] active:scale-95 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
        </Reveal>

        <article className="max-w-4xl mx-auto">
          {/* Hero Image - minimized */}
          <Reveal delay={0.05}>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 shadow-xl bg-[#f8f9fa] dark:bg-[#0d1220] border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </Reveal>

          {/* Meta - enhanced dark mode */}
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="badge badge-accent">{post.category}</span>
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1.5" />
                {post.date}
              </span>
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </span>
              <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4 mr-1.5" />
                {post.author}
              </span>
            </div>
          </Reveal>

          {/* Title - enhanced dark mode */}
          <Reveal delay={0.15}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#00255e] dark:text-[#f9ad07] mb-4 leading-tight">
              {post.title}
            </h1>
          </Reveal>

          {/* Tags - enhanced dark mode */}
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium hover:border-[#f9ad07] hover:text-[#f9ad07] transition-all duration-300 cursor-default hover:scale-[1.05]"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Content - enhanced dark mode */}
          <Reveal delay={0.25}>
            <div className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-10 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="max-w-none prose-headings:text-[#00255e] dark:prose-headings:text-[#f9ad07]">
                {renderContent(post.content)}
              </div>
            </div>
          </Reveal>

          {/* Share - enhanced dark mode */}
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#00255e] dark:text-[#f9ad07]">Share this article</span>
                <button className="p-2 rounded-xl bg-gray-100 dark:bg-[#1a1f2e] hover:bg-[#f9ad07]/10 text-gray-500 dark:text-gray-400 hover:text-[#f9ad07] transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Share article">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-gray-100 dark:bg-[#1a1f2e] hover:bg-[#f9ad07]/10 text-gray-500 dark:text-gray-400 hover:text-[#f9ad07] transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Like article">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <Link
                href="/#contact"
                className="inline-flex items-center px-5 py-2.5 bg-[#00255e] text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-[#001a45] hover:scale-[1.05] active:scale-95 shadow-lg shadow-[#00255e]/20"
              >
                Get Expert Advice <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </article>

        {/* Related Posts - enhanced dark mode */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h2 className="text-2xl font-bold text-[#00255e] dark:text-[#f9ad07] mb-6">
                Related Articles
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related, i) => (
                <Reveal key={related.slug} delay={i * 0.08}>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="card overflow-hidden group hover-lift h-full transition-all duration-300 hover:border-[#f9ad07] border border-gray-200 dark:border-gray-700"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4">
                      <span className="badge badge-accent text-[10px]">{related.category}</span>
                      <h3 className="font-bold text-[#00255e] dark:text-[#f9ad07] mt-2 text-sm group-hover:text-[#f9ad07] transition-colors duration-300 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}