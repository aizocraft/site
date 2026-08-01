"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Building,
  Home,
  Factory,
  HardHat,
  PencilRuler,
  Hammer,
  Paintbrush,
  ClipboardCheck,
  DraftingCompass,
  ShieldCheck,
  ThumbsUp,
  Shield,
  Clock,
  DollarSign,
  Award,
  Headphones,
  Hotel,
  Heart,
  GraduationCap,
  Landmark,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Leaf,
  Users,
  Truck,
  FileCheck,
} from "lucide-react";

const services = [
  { icon: Building, title: "General Contracting", desc: "End-to-end construction management from foundation to finishing, delivered on schedule and budget." },
  { icon: Home, title: "Residential Construction", desc: "Custom homes and apartments built to your exact specifications with premium materials." },
  { icon: Factory, title: "Commercial Buildings", desc: "Offices, retail spaces, warehouses, and industrial facilities engineered for business." },
  { icon: Hammer, title: "Renovation & Remodeling", desc: "Transform existing spaces with structural upgrades, extensions, and modern finishes." },
  { icon: PencilRuler, title: "Architectural Design", desc: "Innovative architectural plans and structural engineering tailored to your vision." },
  { icon: DraftingCompass, title: "Project Management", desc: "Expert supervision, budgeting, and quality control from concept to handover." },
  { icon: ClipboardCheck, title: "Structural Inspection", desc: "Comprehensive structural assessments, compliance audits, and safety certifications." },
  { icon: Paintbrush, title: "Interior & Exterior Finishing", desc: "Flooring, painting, tiling, ceilings, and landscaping for a flawless finish." },
];

const whyChoose = [
  { icon: ShieldCheck, title: "Certified Contractors", desc: "Licensed and insured builders with decades of combined construction experience." },
  { icon: ThumbsUp, title: "Quality Guaranteed", desc: "We use premium materials and follow strict quality control at every stage." },
  { icon: Shield, title: "Safety First", desc: "Comprehensive safety protocols and regular training for all our site teams." },
  { icon: Clock, title: "On-Time Delivery", desc: "Reliable project scheduling with transparent milestones and timely completion." },
  { icon: DollarSign, title: "Transparent Pricing", desc: "Clear, itemized quotations with no hidden fees and flexible payment plans." },
  { icon: Award, title: "Award-Winning Builds", desc: "Recognized for construction excellence across East Africa." },
  { icon: Headphones, title: "Dedicated Support", desc: "Responsive client liaison team available throughout your project and beyond." },
  { icon: Leaf, title: "Sustainable Building", desc: "Eco-friendly materials and energy-efficient designs that reduce environmental impact." },
];

const industries = [
  { icon: Home, title: "Residential" },
  { icon: Hotel, title: "Hospitality" },
  { icon: Heart, title: "Healthcare" },
  { icon: Building, title: "Commercial" },
  { icon: Factory, title: "Industrial" },
  { icon: GraduationCap, title: "Education" },
  { icon: Landmark, title: "Government" },
  { icon: Leaf, title: "Eco Projects" },
];

const projects = [
  {
    title: "Greenpark Residential Estate",
    location: "Nairobi",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Westside Commercial Tower",
    location: "Mombasa",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Eldoret Industrial Warehouse",
    location: "Eldoret",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const testimonials = [
  {
    name: "James Mwangi",
    company: "Greenpark Developers",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "Nenes Construction delivered our residential estate ahead of schedule. Exceptional craftsmanship, professional team, and flawless attention to detail. Highly recommended.",
  },
  {
    name: "Grace Akinyi",
    company: "Westside Properties",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "The commercial tower project exceeded our expectations. Nenes's engineers demonstrated incredible expertise and commitment to quality construction.",
  },
  {
    name: "Peter Kamau",
    company: "Eldoret Industries",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "Our industrial warehouse was completed flawlessly. Nenes's project management and structural expertise have significantly improved our operations.",
  },
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => setTestimonialIndex((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      {/* Hero Section - solid green-tinted background, no gradient */}
      <section className="hero-section relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="hero-pattern absolute inset-0" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-hero-chip-bg)] border border-[var(--color-hero-chip-border)] rounded-full text-sm text-[var(--color-hero-text)]">
                  <HardHat className="w-4 h-4 text-[var(--color-hero-highlight)]" />
                  Building Excellence Since 2010
                </span>
                <span className="px-3 py-1.5 bg-[var(--color-highlight)] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  Trusted Builder
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-hero-text)] leading-[1.08] tracking-tight">
                We Build{" "}
                <span className="text-[var(--color-hero-highlight)]">Dreams</span>{" "}
                <span className="opacity-40">&</span>{" "}
                <span className="text-[var(--color-hero-highlight-2)]">Structures</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--color-hero-muted)] leading-relaxed max-w-xl tracking-wide">
                Professional construction services — residential, commercial, and
                industrial building across Kenya. From design to handover.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="btn-accent text-base py-3.5 px-8 shadow-2xl shadow-[#14532d]/25 hover:shadow-[#14532d]/40"
                >
                  Request Quote <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex items-center px-8 py-3.5 bg-[var(--color-hero-chip-bg)] text-[var(--color-hero-text)] border border-[var(--color-hero-chip-border)] rounded-xl hover:border-[var(--color-hero-highlight)] hover:-translate-y-0.5 transition-all duration-300 font-semibold text-base"
                >
                  Our Services
                </Link>
              </div>

              <div className="flex items-center gap-10 pt-6 border-t border-[var(--color-hero-chip-border)]">
                {[
                  { value: "15+", label: "Years Experience" },
                  { value: "300+", label: "Projects Built" },
                  { value: "250+", label: "Happy Clients" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="text-4xl md:text-5xl font-bold text-[var(--color-hero-highlight)]">{stat.value}</span>
                    <span className="block text-sm text-[var(--color-hero-muted)] mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:max-w-2xl lg:ml-auto">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-hero-chip-border)]">
                <Image
                  src="/banner.png"
                  alt="Construction engineers at work"
                  width={1400}
                  height={1050}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              <div className="absolute -top-5 -left-3 sm:-left-5 bg-[var(--color-card-bg)] rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[var(--color-highlight-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[var(--color-highlight)]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--color-foreground)]">15+ Years</p>
                  <p className="text-xs text-[var(--color-muted)]">of Excellence</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-[var(--color-card-bg)] rounded-2xl p-4 sm:p-5 shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-[var(--color-foreground)]">Certified & Insured</p>
                    <p className="text-xs sm:text-sm text-[var(--color-muted)]">Licensed Contractors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-[var(--color-card-bg)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="badge badge-primary">About Us</span>
              <h2 className="heading-lg text-[var(--color-primary)] mt-2 mb-4">
                Building Kenya&apos;s Future with Reliable Construction
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Nenes Construction is a premier construction company dedicated
                to delivering high-quality residential, commercial, and industrial buildings.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                With a team of certified engineers, architects, and skilled builders,
                we serve clients across Kenya — from single-family homes to large-scale
                commercial developments.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Truck, title: "Modern Fleet", desc: "Fully equipped site machinery" },
                  { icon: Users, title: "120+ Workforce", desc: "Skilled engineers & builders" },
                ].map((item) => (
                  <div key={item.title} className="card p-4 flex items-center gap-3 hover-lift">
                    <div className="w-11 h-11 bg-[var(--color-primary-icon-bg)] rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--color-foreground)]">{item.title}</h3>
                      <p className="text-xs text-[var(--color-muted)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: DraftingCompass,
                  title: "Our Mission",
                  desc: "To deliver safe, sustainable, and high-quality structures that power progress for communities and businesses.",
                },
                {
                  icon: TrendingUp,
                  title: "Our Vision",
                  desc: "To be East Africa's most trusted construction and building partner.",
                },
                {
                  icon: Users,
                  title: "Core Values",
                  desc: "Safety, Integrity, Quality, Innovation, Client Focus, Sustainability.",
                },
              ].map((item) => (
                <div key={item.title} className="card p-6 flex items-start gap-4 hover-lift">
                  <div className="w-12 h-12 bg-[var(--color-primary-icon-bg)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-foreground)]">{item.title}</h3>
                    <p className="text-sm text-[var(--color-muted)] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding section-alt">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-accent">Our Services</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">
              Comprehensive Construction Services
            </h2>
            <p className="text-[var(--color-muted)] mt-3">
              From design to handover, we provide end-to-end construction services
              tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card p-6 card-hover group">
                <div className="w-14 h-14 bg-[var(--color-primary-icon-bg)] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-[var(--color-foreground)]">{service.title}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose" className="section-padding bg-[var(--color-card-bg)]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-highlight">Why Choose Us</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">The Nenes Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, index) => (
              <div key={index} className="card p-6 text-center card-hover">
                <div className="w-14 h-14 bg-[var(--color-highlight-soft)] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-[var(--color-highlight)]" />
                </div>
                <h3 className="font-semibold text-[var(--color-foreground)]">{item.title}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="section-padding section-alt">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-primary">Industries</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">Serving Diverse Sectors</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="card p-6 text-center card-hover group">
                <div className="w-14 h-14 mx-auto mb-3 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--color-accent)]">
                  <industry.icon className="w-7 h-7 text-[var(--color-accent)] group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="font-medium text-[var(--color-foreground)] text-sm">{industry.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="gallery" className="section-padding bg-[var(--color-card-bg)]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-accent">Portfolio</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">Featured Projects</h2>
            <p className="text-[var(--color-muted)] mt-3">
              Explore some of our recent construction projects across Kenya.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="card overflow-hidden group hover-lift">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="badge badge-accent text-xs">{project.category}</span>
                  <h3 className="font-bold text-[var(--color-foreground)] mt-2 group-hover:text-[var(--color-accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)]">{project.location}</p>
                  <Link
                    href={`/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center mt-3 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors group/link"
                  >
                    View Details
                    <span className="ml-1.5 group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/portfolio" className="btn-primary">
              View All Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding bg-[var(--color-cta-bg)] text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-white/10 text-white border-white/20">
              Testimonials
            </span>
            <h2 className="heading-lg text-white mt-2">What Our Clients Say</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 relative">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={testimonials[testimonialIndex].image}
                  alt={testimonials[testimonialIndex].name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <p className="font-bold text-white">{testimonials[testimonialIndex].name}</p>
                  <p className="text-sm text-white/60">{testimonials[testimonialIndex].company}</p>
                  <div className="flex text-[var(--color-highlight)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-lg leading-relaxed">
                "{testimonials[testimonialIndex].quote}"
              </p>
              <div className="flex justify-end mt-6 gap-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-xl border border-white/20 hover:bg-white/10 hover:scale-105 transition-all"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-xl border border-white/20 hover:bg-white/10 hover:scale-105 transition-all"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section-padding bg-[var(--color-card-bg)]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-highlight">Our Process</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">How We Build</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {["Consultation", "Design", "Planning", "Construction", "Inspection", "Handover"].map(
              (step, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 mx-auto bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg shadow-[var(--color-primary-soft)] group-hover:scale-110 group-hover:bg-[var(--color-accent)] transition-all duration-300">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{step}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[var(--color-cta-bg)] text-white">
        <div className="container-custom text-center">
          <h2 className="heading-lg">Need Reliable Builders?</h2>
          <p className="text-white/80 mt-3 text-lg">Request a Free Site Visit Today</p>
          <Link href="/#contact" className="btn-accent mt-6 inline-block">
            Get Quote
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding section-alt">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-primary">Contact</span>
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">Get In Touch</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" className="input-field" />
                  <input type="tel" placeholder="Phone Number" className="input-field" />
                </div>
                <input type="email" placeholder="Email Address" className="input-field" />
                <select className="input-field">
                  <option>Select Service</option>
                  <option>General Contracting</option>
                  <option>Residential Construction</option>
                  <option>Commercial Building</option>
                  <option>Renovation</option>
                  <option>Other</option>
                </select>
                <textarea rows={4} placeholder="Message" className="input-field" />
                <button type="submit" className="btn-primary w-full justify-center">
                  Send Message
                </button>
              </form>
            </div>
            <div className="space-y-4">
              {[
                { icon: MapPin, title: "Office", content: "Nairobi, Kenya\nMombasa Road" },
                { icon: Clock, title: "Working Hours", content: "Mon-Fri: 8AM - 6PM\nSat: 9AM - 2PM" },
                { icon: Phone, title: "Phone", content: "24/7: +254 700 123 456" },
                { icon: Mail, title: "Email", content: "info@nenes.co.ke" },
              ].map((item) => (
                <div key={item.title} className="card p-6 hover-lift">
                  <h3 className="font-bold text-[var(--color-foreground)] flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-[var(--color-accent)]" />
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-muted)] text-sm mt-1 whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              ))}
              <div className="card overflow-hidden p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853743783!2d36.68219671406249!3d-1.3028611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1620000000000"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Nenes Construction Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
