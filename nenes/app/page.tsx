"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowDown,
  Check,
  HardHat,
  Building,
  Home,
  Factory,
  Hammer,
  PencilRuler,
  DraftingCompass,
  ClipboardCheck,
  Paintbrush,
  Headphones,
  FileCheck,
  ThumbsUp,
  Minus,
  Plus
} from "lucide-react";
import { PORTFOLIO_PROJECTS } from "./portfolio/data";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";

// Types
interface Service {
  icon: React.ElementType;
  title: string;
  desc: string;
  details: string[];
}

interface ServiceDetailProps {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
}

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  isActive: boolean;
}

// Data
const services: Service[] = [
  {
    icon: Building,
    title: "General Contracting",
    desc: "End-to-end construction management from foundation to finishing, delivered on schedule and budget.",
    details: [
      "Complete project lifecycle management",
      "Budget planning and cost control",
      "Quality assurance at every stage",
      "Regulatory compliance and permits",
    ],
  },
  {
    icon: Home,
    title: "Residential Construction",
    desc: "Custom homes and apartments built to your exact specifications with premium materials.",
    details: [
      "Custom home design and build",
      "Apartment complexes",
      "Estate developments",
      "High-end finishes and fixtures",
    ],
  },
  {
    icon: Factory,
    title: "Commercial Buildings",
    desc: "Offices, retail spaces, warehouses, and industrial facilities engineered for business.",
    details: [
      "Office buildings and corporate HQ",
      "Retail and shopping centers",
      "Warehouses and logistics hubs",
      "Industrial manufacturing plants",
    ],
  },
  {
    icon: Hammer,
    title: "Renovation & Remodeling",
    desc: "Transform existing spaces with structural upgrades, extensions, and modern finishes.",
    details: [
      "Structural renovations",
      "Space extensions",
      "Modern interior upgrades",
      "Building refurbishment",
    ],
  },
  {
    icon: PencilRuler,
    title: "Architectural Design",
    desc: "Innovative architectural plans and structural engineering tailored to your vision.",
    details: [
      "3D architectural modeling",
      "Structural engineering",
      "Sustainable design solutions",
      "Interior design planning",
    ],
  },
  {
    icon: DraftingCompass,
    title: "Project Management",
    desc: "Expert supervision, budgeting, and quality control from concept to handover.",
    details: [
      "Project scheduling and planning",
      "Budget management",
      "Quality control inspections",
      "Stakeholder communication",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Structural Inspection",
    desc: "Comprehensive structural assessments, compliance audits, and safety certifications.",
    details: [
      "Structural integrity assessments",
      "Safety compliance audits",
      "Material quality testing",
      "Certification and documentation",
    ],
  },
  {
    icon: Paintbrush,
    title: "Interior & Exterior Finishing",
    desc: "Flooring, painting, tiling, ceilings, and landscaping for a flawless finish.",
    details: [
      "Premium flooring solutions",
      "Interior painting and finishing",
      "Tiling and stonework",
      "Landscaping and exteriors",
    ],
  },
];

// Service Detail Component
function ServiceDetail({ service, isOpen, onToggle }: ServiceDetailProps) {
  return (
    <div className="border border-[var(--color-nav-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--color-accent)]/20">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-start gap-4 hover:bg-[var(--color-nav-toggle-bg)] transition-colors duration-200 text-left"
      >
        <div className="w-12 h-12 bg-[var(--color-primary-icon-bg)] rounded-xl flex items-center justify-center flex-shrink-0">
          <service.icon className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[var(--color-foreground)]">{service.title}</h3>
              <p className="text-sm text-[var(--color-muted)] mt-0.5">{service.desc}</p>
            </div>
            <div className="flex-shrink-0">
              {isOpen ? (
                <Minus className="w-5 h-5 text-[var(--color-muted)]" />
              ) : (
                <Plus className="w-5 h-5 text-[var(--color-muted)]" />
              )}
            </div>
          </div>
        </div>
      </button>
      <div
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <div className="border-t border-[var(--color-nav-border)] pt-4">
          <ul className="space-y-2">
            {service.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-foreground)]">
                <Check className="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Process Step Component
function ProcessStep({ number, title, description, icon: Icon, isActive }: ProcessStepProps) {
  return (
    <div
      className={`relative p-6 rounded-2xl border transition-all duration-300 ${
        isActive
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-lg scale-105"
          : "border-[var(--color-nav-border)] bg-[var(--color-card-bg)] hover:shadow-md hover:border-[var(--color-accent)]/20"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
            isActive
              ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-soft)]"
              : "bg-[var(--color-primary-icon-bg)] text-[var(--color-primary)]"
          }`}
        >
          <Icon className="w-7 h-7" />
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-sm font-bold shadow-lg">
          {number}
        </div>
        <h4 className="font-bold text-[var(--color-foreground)]">{title}</h4>
        <p className="text-sm text-[var(--color-muted)] mt-1">{description}</p>
      </div>
    </div>
  );
}

// Scroll Reveal Hook
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function HomePage() {
  const [openServiceIndex, setOpenServiceIndex] = useState<number | null>(null);
  const [activeProcess, setActiveProcess] = useState(0);

  useScrollReveal();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProcess((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleService = (index: number) => {
    setOpenServiceIndex(openServiceIndex === index ? null : index);
  };

  const scrollDown = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const processSteps = [
    { number: 1, title: "Consultation", description: "We discuss your vision, requirements, and budget", icon: Headphones },
    { number: 2, title: "Design", description: "Architectural plans and structural engineering", icon: DraftingCompass },
    { number: 3, title: "Planning", description: "Detailed project roadmap and resource allocation", icon: FileCheck },
    { number: 4, title: "Construction", description: "Quality building with regular inspections", icon: Hammer },
    { number: 5, title: "Inspection", description: "Rigorous quality and safety checks", icon: ClipboardCheck },
    { number: 6, title: "Handover", description: "Final walkthrough and project completion", icon: ThumbsUp },
  ];

  const featuredProjects = PORTFOLIO_PROJECTS.slice(0, 3);

  return (
    <>
      {/* Hero Section - Construction Themed */}
      <section className="relative overflow-hidden bg-[var(--color-hero-bg)]">
        {/* Construction Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.1) 80px, rgba(255,255,255,0.1) 81px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.1) 80px, rgba(255,255,255,0.1) 81px)
            `
          }} />
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-accent)]/3 rounded-full blur-2xl"></div>

        <div className="container-custom relative z-10 pt-28 md:pt-36 pb-14 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <div className="space-y-7 reveal">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-hero-chip-bg)] border border-[var(--color-hero-chip-border)] rounded-full text-sm text-[var(--color-hero-text)]">
                  <HardHat className="w-4 h-4 text-[var(--color-hero-highlight)]" />
                  NICA Certified
                </span>
                <span className="px-3 py-1.5 bg-[var(--color-hero-highlight)] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-[var(--color-accent)]/30">
                  Trusted Builder
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--color-hero-text)] leading-[1.1] tracking-tight">
                We Build{" "}
                <span className="text-[var(--color-hero-highlight)] relative">
                  Dreams
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-[var(--color-hero-highlight)] opacity-30 rounded-full" />
                </span>{" "}
                <span className="text-[var(--color-hero-muted)]">&</span>{" "}
                <span className="text-[var(--color-hero-highlight-2)]">Structures</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-hero-muted)] leading-relaxed max-w-xl">
                Professional construction services — residential, commercial, and industrial building across Kenya. From design to handover.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center px-8 py-3.5 bg-[var(--color-hero-highlight)] text-white rounded-xl font-semibold text-base shadow-2xl shadow-[var(--color-accent)]/40 hover:shadow-[var(--color-accent)]/60 hover:-translate-y-1 transition-all duration-300 group"
                >
                  Request Quote
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex items-center px-8 py-3.5 bg-[var(--color-hero-chip-bg)] text-[var(--color-hero-text)] border border-[var(--color-hero-chip-border)] rounded-xl hover:border-[var(--color-accent)] hover:-translate-y-1 transition-all duration-300 font-semibold text-base"
                >
                  Our Services
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-6 border-t border-[var(--color-hero-chip-border)]">
                {[
                  { value: "15+", label: "Years Experience" },
                  { value: "300+", label: "Projects Built" },
                  { value: "250+", label: "Happy Clients" },
                ].map((stat) => (
                  <div key={stat.label} className="group">
                    <span className="text-3xl md:text-4xl font-bold text-[var(--color-hero-highlight)] group-hover:scale-105 transition-transform inline-block">
                      {stat.value}
                    </span>
                    <span className="block text-sm text-[var(--color-hero-muted)] mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero Image */}
            <div className="relative w-full reveal animation-delay-300">
              <div className="relative w-full h-auto rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-hero-chip-border)]">
                <Image
                  src="/aboutbanner1.png"
                  alt="Construction engineers at work"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  priority
                  quality={100}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Down */}
        <button
          onClick={scrollDown}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow text-[var(--color-hero-muted)] hover:text-[var(--color-hero-highlight)] transition-colors duration-300 group"
          aria-label="Scroll down"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest font-medium opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
            <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
          </div>
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-[var(--color-card-bg)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <span className="badge badge-primary">About Us</span>
              <h2 className="heading-lg text-[var(--color-primary)] mt-2 mb-4">
                Building Kenya&apos;s Future with Reliable Construction
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Nenes Construction is a premier construction company dedicated to delivering high-quality residential, commercial, and industrial buildings.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                With a team of certified engineers, architects, and skilled builders, we serve clients across Kenya — from single-family homes to large-scale commercial developments.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-[var(--color-accent-soft)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[var(--color-accent)] transition-colors duration-300">
                    <Check className="w-4 h-4 text-[var(--color-accent)] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-foreground)]">Our Mission</h4>
                    <p className="text-sm text-[var(--color-muted)]">To deliver safe, sustainable, and high-quality structures that power progress.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-[var(--color-accent-soft)] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[var(--color-accent)] transition-colors duration-300">
                    <Check className="w-4 h-4 text-[var(--color-accent)] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-foreground)]">Our Vision</h4>
                    <p className="text-sm text-[var(--color-muted)]">To be East Africa&apos;s most trusted construction and building partner.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full reveal animation-delay-300">
              <div className="relative w-full h-auto rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/nenesposter1.png"
                  alt="Nenes Construction - Building Kenya's Future"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  quality={100}
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding section-alt">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="badge badge-primary">What We Offer</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">Our Services</h2>
            <p className="text-[var(--color-muted)] mt-3">Comprehensive construction solutions tailored to your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="reveal" style={{ animationDelay: `${index * 100}ms` }}>
                <ServiceDetail
                  service={service}
                  isOpen={openServiceIndex === index}
                  onToggle={() => toggleService(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="section-padding bg-[var(--color-card-bg)]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="badge badge-primary">How We Work</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">Our Process</h2>
            <p className="text-[var(--color-muted)] mt-3">A streamlined approach to bring your vision to life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="reveal" style={{ animationDelay: `${index * 150}ms` }}>
                <ProcessStep
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  isActive={activeProcess === index}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {processSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveProcess(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeProcess === index ? "w-8 bg-[var(--color-accent)]" : "w-2 bg-[var(--color-nav-border)] hover:bg-[var(--color-muted)]"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="gallery" className="section-padding section-alt">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="badge badge-primary">Portfolio</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">Featured Projects</h2>
            <p className="text-[var(--color-muted)] mt-3">Explore some of our recent construction projects across Kenya</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={project.slug}
                className="card overflow-hidden group hover-lift reveal"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="badge bg-white/20 text-white border-white/30 backdrop-blur-sm">{project.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">{project.title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{project.location}</p>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center mt-3 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors group/link"
                  >
                    View Details
                    <span className="ml-1.5 group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 reveal">
            <Link href="/portfolio" className="btn-primary">
              View All Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Component */}
      <Testimonials />

      {/* Contact Component */}
      <Contact />

      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal.animation-delay-200 { transition-delay: 0.2s; }
        .reveal.animation-delay-300 { transition-delay: 0.3s; }
        .reveal.animation-delay-400 { transition-delay: 0.4s; }
        .reveal.animation-delay-500 { transition-delay: 0.5s; }
        .reveal.animation-delay-600 { transition-delay: 0.6s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
        .delay-1000 { animation-delay: 1s; }
        .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
        html { scroll-behavior: smooth; }
        *:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
        ::selection { background: var(--color-accent); color: white; }
      `}</style>
    </>
  );
}