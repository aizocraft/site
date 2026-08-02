import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Clock, ChevronLeft, Share2, Bookmark, ArrowLeft, Tag } from "lucide-react";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "../data";

// Generate static params for all blog posts
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <>
      {/* Minimal Hero - Consistent size */}
      <section className="relative overflow-hidden bg-[var(--color-hero-bg)] border-b border-[var(--color-nav-border)]">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="container-custom relative z-10 pt-28 md:pt-36 pb-14 md:pb-20">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <div className="max-w-3xl">
            <span className="badge badge-accent">{post.category}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--color-hero-text)] leading-tight mt-2">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-[var(--color-hero-muted)]">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="section-padding bg-[var(--color-bg)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-8">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                {post.featured && (
                  <span className="absolute top-4 left-4 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white shadow-lg">
                    Featured
                  </span>
                )}
              </div>

              <article className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              <div className="mt-8 pt-6 border-t border-[var(--color-nav-border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-[var(--color-muted)] mr-1" />
                  <span className="text-sm font-semibold text-[var(--color-foreground)] mr-2">Tags:</span>
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-nav-border)] text-sm text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)] transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm font-semibold text-[var(--color-foreground)]">Share:</span>
                <button className="p-2 rounded-lg border border-[var(--color-nav-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all group">
                  <Share2 className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </button>
                <button className="p-2 rounded-lg border border-[var(--color-nav-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-all group">
                  <Bookmark className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6 text-center hover:border-[var(--color-accent)]/20 transition-all duration-300">
                <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/10">
                  <Image
                    src={post.authorImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-[var(--color-foreground)]">{post.author}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">Construction Expert</p>
                {post.authorBio && (
                  <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">{post.authorBio}</p>
                )}
              </div>

              {relatedPosts.length > 0 && (
                <div className="card p-6 hover:border-[var(--color-accent)]/20 transition-all duration-300">
                  <h3 className="font-bold text-[var(--color-foreground)] mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <span className="text-xs text-[var(--color-muted)]">{relatedPost.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:gap-3 transition-all group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to all blog posts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}