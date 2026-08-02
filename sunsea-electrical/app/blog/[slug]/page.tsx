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
      <strong key={`${keyPrefix}-b-${i}`} className="font-bold text-[#00255e] dark:text-white">
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
            className="text-[var(--color-muted)] leading-relaxed pl-1 marker:text-[#f9ad07]"
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
      <p key={`p-${i}`} className="text-[var(--color-muted)] leading-relaxed mb-4">
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
        {/* Back link */}
        <Reveal direction="right">
          <Link
            href="/blog"
            className="inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
        </Reveal>

        <article className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <Reveal delay={0.05}>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-xl bg-[#f8f9fa] dark:bg-[#0d1220]">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </Reveal>

          {/* Meta */}
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="badge badge-accent">{post.category}</span>
              <span className="flex items-center text-sm text-[var(--color-muted)]">
                <Calendar className="w-4 h-4 mr-1.5" />
                {post.date}
              </span>
              <span className="flex items-center text-sm text-[var(--color-muted)]">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </span>
              <span className="flex items-center text-sm text-[var(--color-muted)]">
                <User className="w-4 h-4 mr-1.5" />
                {post.author}
              </span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={0.15}>
            <h1 className="heading-lg text-[#00255e] dark:text-white mb-6">
              {post.title}
            </h1>
          </Reveal>

          {/* Tags */}
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--color-section-alt)] border border-[var(--color-card-border)] text-[var(--color-muted)] rounded-lg text-xs font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors cursor-default"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Content */}
          <Reveal delay={0.25}>
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-10 shadow-sm">
              <div className="max-w-none prose-headings:text-[#00255e] dark:prose-headings:text-white">
                {renderContent(post.content)}
              </div>
            </div>
          </Reveal>

          {/* Share */}
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12 pt-8 border-t border-[var(--color-card-border)]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#00255e] dark:text-white">Share this article</span>
                <button className="p-2 rounded-xl bg-[var(--color-section-alt)] hover:bg-[var(--color-accent-soft)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:scale-105 transition-all" aria-label="Share article">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-[var(--color-section-alt)] hover:bg-[var(--color-accent-soft)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:scale-105 transition-all" aria-label="Like article">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <Link
                href="/#contact"
                className="btn-primary text-sm py-2.5 px-5"
              >
                Get Expert Advice <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h2 className="text-2xl font-bold text-[#00255e] dark:text-white mb-8">
                Related Articles
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related, i) => (
                <Reveal key={related.slug} delay={i * 0.08}>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="card overflow-hidden group hover-lift h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="badge badge-accent text-[10px]">{related.category}</span>
                      <h3 className="font-bold text-[#00255e] dark:text-white mt-2 text-sm group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] mt-2 line-clamp-2">
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

