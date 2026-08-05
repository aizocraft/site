"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, use } from "react";
import {
  ArrowLeft,
  Layers,
  MapPin,
  Star,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Grid,
} from "lucide-react";
import { PORTFOLIO_PROJECTS, getProjectBySlug, type Project } from "../data";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Get related projects (excluding current)
  const relatedProjects = useMemo(() => {
    return PORTFOLIO_PROJECTS.filter((p) => p.slug !== slug).slice(0, 3);
  }, [slug]);

  // If project not found
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[var(--color-card-bg)] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-nav-border)]">
            <Layers className="w-10 h-10 text-[var(--color-muted)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Project Not Found</h1>
          <p className="text-[var(--color-muted)] mt-2">The project you're looking for doesn't exist or has been moved.</p>
          <Link href="/portfolio" className="btn-primary mt-6 inline-block">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

const images = project.gallery || [project.image];

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    name: project.title,
    description: project.description,
    url: `https://nenesconstruction.vercel.app/portfolio/${project.slug}`,
    image: project.gallery?.[0] || project.image,
    location: {
      "@type": "Place",
      name: project.location,
    },
    category: project.category,
    keywords: ["construction", "Kenya", project.category, project.location],
    founder: {
      "@type": "Organization",
      name: "Nenes Construction",
      url: "https://nenesconstruction.vercel.app",
    },
  };

  const nextImage = (): void => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (): void => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden bg-[var(--color-hero-bg)] border-b border-[var(--color-nav-border)]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px)
            `
          }} />
        </div>
        <div className="container-custom relative z-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Portfolio
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="badge badge-accent">{project.category}</span>
            <span className="text-sm text-[var(--color-muted)]">{project.year}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-hero-text)] leading-tight">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-[var(--color-hero-muted)]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {project.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {project.duration}
            </div>
          </div>
          <p className="text-lg text-[var(--color-hero-muted)] mt-4 max-w-2xl">
            {project.description}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] group">
                <Image
                  src={images[activeImage]}
                  alt={`${project.title} - Image ${activeImage + 1}`}
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                  aria-label="View full screen"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-3 py-1 text-xs text-white">
                  {activeImage + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === idx 
                          ? "border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent-soft)]" 
                          : "border-transparent hover:border-[var(--color-nav-border)]"
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        width={96}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Materials Used */}
              <div className="mt-12">
                <h2 className="text-xl font-bold text-[var(--color-foreground)] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[var(--color-accent)]" />
                  Materials Used
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {project.materials.map((material: string) => (
                    <div
                      key={material}
                      className="flex items-center gap-2.5 rounded-xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)] px-4 py-3 text-sm text-[var(--color-foreground)]"
                    >
                      <Check className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" />
                      {material}
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {project.testimonial && (
                <div className="mt-12 p-6 md:p-8 rounded-2xl border border-[var(--color-nav-border)] bg-[var(--color-card-bg)]">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i: number) => (
                      <Star key={i} className="w-5 h-5 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-[var(--color-foreground)] leading-relaxed">
                    "{project.testimonial.quote}"
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-[var(--color-muted)]">
                    — {project.testimonial.author}
                  </figcaption>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-4">
                <div className="card p-6">
                  <h3 className="font-bold text-[var(--color-foreground)] mb-4">Project Details</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-[var(--color-nav-border)]">
                      <dt className="text-[var(--color-muted)]">Category</dt>
                      <dd className="font-medium text-[var(--color-foreground)]">{project.category}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--color-nav-border)]">
                      <dt className="text-[var(--color-muted)]">Location</dt>
                      <dd className="font-medium text-[var(--color-foreground)]">{project.location}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--color-nav-border)]">
                      <dt className="text-[var(--color-muted)]">Duration</dt>
                      <dd className="font-medium text-[var(--color-foreground)]">{project.duration}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-[var(--color-muted)]">Year Completed</dt>
                      <dd className="font-medium text-[var(--color-foreground)]">{project.year}</dd>
                    </div>
                  </dl>
                </div>

                <div className="card p-6 bg-[var(--color-primary-soft)] border-[var(--color-primary)]/20">
                  <h3 className="font-bold text-[var(--color-foreground)] mb-2">Ready to Build?</h3>
                  <p className="text-sm text-[var(--color-muted)] mb-4">
                    Let's discuss your project and bring your vision to life.
                  </p>
                  <Link href="/#contact" className="btn-primary w-full text-center justify-center">
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="section-padding section-alt">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((related: Project) => (
                <Link
                  key={related.slug}
                  href={`/portfolio/${related.slug}`}
                  className="card overflow-hidden group hover-lift"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <span className="badge badge-accent text-[10px]">{related.category}</span>
                    <h3 className="font-bold text-[var(--color-foreground)] mt-2 group-hover:text-[var(--color-accent)] transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {related.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full aspect-video bg-black/50 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeImage]}
              alt={`${project.title} - Full screen view`}
              width={1200}
              height={675}
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-4 py-1.5 text-sm text-white">
                  {activeImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}