"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Sun,
  Battery,
  Wrench,
  Building,
  Factory,
  ClipboardCheck,
  Settings,
  Cpu,
  BarChart,
  ShieldCheck,
  ThumbsUp,
  Shield,
  Clock,
  DollarSign,
  Award,
  Headphones,
  Home,
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
  ShoppingBag,
  TrendingUp,
  Leaf,
  Users,
} from "lucide-react";

const services = [
  { icon: Zap, title: "Electrical Installation", desc: "Professional wiring, panel upgrades, and complete electrical installations for any property." },
  { icon: Sun, title: "Solar Power Systems", desc: "Custom solar panel installations with battery storage for homes and businesses." },
  { icon: Battery, title: "Backup Power", desc: "Generator and UPS installations to keep your operations running during outages." },
  { icon: Wrench, title: "Maintenance & Repairs", desc: "Regular maintenance and emergency repair services for all electrical systems." },
  { icon: Building, title: "Commercial Wiring", desc: "Complete electrical solutions for offices, retail spaces, and commercial buildings." },
  { icon: Factory, title: "Industrial Electrical", desc: "High-voltage systems, motor controls, and automation for industrial facilities." },
  { icon: ClipboardCheck, title: "Energy Audits", desc: "Comprehensive energy assessments to optimize consumption and reduce costs." },
  { icon: Settings, title: "Smart Home Automation", desc: "IoT-enabled lighting, security, and climate control for modern living." },
];

const whyChoose = [
  { icon: ShieldCheck, title: "Certified Professionals", desc: "Licensed and insured engineers with years of industry experience." },
  { icon: ThumbsUp, title: "Quality Guaranteed", desc: "We use premium materials and follow strict quality control standards." },
  { icon: Shield, title: "Safety First", desc: "Comprehensive safety protocols and regular training for all our teams." },
  { icon: Clock, title: "Reliable Support", desc: "24/7 emergency support and responsive customer service team." },
  { icon: DollarSign, title: "Competitive Pricing", desc: "Transparent quotes with no hidden fees and flexible payment options." },
  { icon: Award, title: "Award-Winning Service", desc: "Recognized for excellence in electrical engineering across East Africa." },
  { icon: Headphones, title: "Personalized Approach", desc: "Tailored solutions designed around your specific needs and budget." },
  { icon: BarChart, title: "Energy Efficient", desc: "Solutions designed to minimize energy consumption and environmental impact." },
];

const industries = [
  { icon: Home, title: "Residential" },
  { icon: Hotel, title: "Hospitality" },
  { icon: Heart, title: "Healthcare" },
  { icon: Building, title: "Commercial" },
  { icon: Factory, title: "Industrial" },
  { icon: GraduationCap, title: "Education" },
  { icon: Landmark, title: "Government" },
  { icon: Sun, title: "Solar Energy" },
];

const projects = [
  {
    title: "KCB Tower Backup System",
    location: "Nairobi",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Mombasa Solar Farm",
    location: "Mombasa",
    category: "Solar",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Eldoret Industrial Plant",
    location: "Eldoret",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const testimonials = [
  {
    name: "James Mwangi",
    company: "KCB Group",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "SunSea Electrical delivered exceptional service for our backup power system. Professional, on-time, and within budget. Highly recommended.",
  },
  {
    name: "Grace Akinyi",
    company: "Mombasa Solar Initiative",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "The solar farm project exceeded our expectations. SunSea's team demonstrated incredible expertise and dedication to clean energy.",
  },
  {
    name: "Peter Kamau",
    company: "Eldoret Manufacturers",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "Our industrial plant's electrical infrastructure was completed flawlessly. SunSea's automation solutions have significantly improved our production efficiency.",
  },
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => setTestimonialIndex((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      {/* Hero Section - Clear Light/Dark scheme, sleek minimal */}
      <section className="hero-gradient relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="hero-pattern absolute inset-0" />

        {/* Accent glows */}
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-[var(--color-hero-glow-1)] rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-[var(--color-hero-glow-2)] rounded-full blur-[100px]" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-hero-chip-bg)] backdrop-blur-sm border border-[var(--color-hero-chip-border)] rounded-full text-sm text-[var(--color-hero-text)]">
                   Electrical Excellence Since 2010
                </span>
                <span className="px-3 py-1.5 bg-[var(--color-hero-highlight)] text-[#00255e] rounded-full text-xs font-bold uppercase tracking-wider">
                  Trusted Partner
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[var(--color-hero-text)] leading-[1.08] tracking-tight">
                Powering Homes,{" "}
                <span className="text-[var(--color-hero-highlight)]">Businesses</span>{" "}
                <span className="opacity-40">&</span>{" "}
                <span className="text-[var(--color-hero-highlight-2)]">Industries</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--color-hero-muted)] leading-relaxed max-w-xl tracking-wide">
                Professional electrical installations, maintenance, solar energy solutions,
                and industrial electrical engineering across Kenya.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="btn-accent text-base py-3.5 px-8 shadow-2xl shadow-[#f9ad07]/25 hover:shadow-[#f9ad07]/40"
                >
                  Request Quote <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/#services"
                  className="inline-flex items-center px-8 py-3.5 bg-[var(--color-hero-chip-bg)] backdrop-blur-sm text-[var(--color-hero-text)] border border-[var(--color-hero-chip-border)] rounded-xl hover:border-[var(--color-hero-highlight)] hover:-translate-y-0.5 transition-all duration-300 font-semibold text-base"
                >
                  Our Services
                </Link>
              </div>

              <div className="flex items-center gap-10 pt-6 border-t border-[var(--color-hero-chip-border)]">
                {[
                  { value: "15+", label: "Years Experience" },
                  { value: "500+", label: "Projects Done" },
                  { value: "300+", label: "Happy Clients" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="text-4xl md:text-5xl font-bold text-[var(--color-hero-highlight)]">{stat.value}</span>
                    <span className="block text-sm text-[var(--color-hero-muted)] mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:max-w-2xl lg:ml-auto">
              {/* Decorative glow ring behind image */}
              <div className="absolute -inset-6 rounded-[2rem] bg-[var(--color-hero-glow-1)] blur-2xl opacity-60" />

              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-hero-chip-border)]">
                <Image
                  src="/banner.png"
                  alt="Electrical engineer working"
                  width={1400}
                  height={1050}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              {/* Floating badge - top left (visible on all screens) */}
              <div className="absolute -top-5 -left-3 sm:-left-5 bg-[var(--color-card-bg)] rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[var(--color-highlight-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[var(--color-highlight)]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--color-foreground)]">15+ Years</p>
                  <p className="text-xs text-[var(--color-muted)]">of Excellence</p>
                </div>
              </div>

              {/* Floating card - bottom right (visible on all screens) */}
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-[var(--color-card-bg)] rounded-2xl p-4 sm:p-5 shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-[var(--color-foreground)]">Certified & Insured</p>
                    <p className="text-xs sm:text-sm text-[var(--color-muted)]">Licensed Professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Coming Soon - Featured Section */}
      <section className="section-padding section-alt">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12 text-center border-2 border-[var(--color-highlight-soft)] relative overflow-hidden hover-lift">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-highlight-soft)] rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent-soft)] rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--color-highlight-soft)] rounded-full mb-6">
                  <ShoppingBag className="w-5 h-5 text-[var(--color-highlight)]" />
                  <span className="text-sm font-semibold text-[var(--color-primary)]">Shop Coming Soon</span>
                </div>

                <h2 className="heading-lg text-[var(--color-primary)] mb-4">
                  The SunSea <span className="text-[var(--color-accent)]">Electrical Store</span>
                </h2>

                <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
                  Get premium electrical equipment, solar panels, and automation devices
                  delivered to your doorstep. Launching soon!
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                  {[
                    { icon: Sun, label: "Solar Panels" },
                    { icon: Battery, label: "Inverters" },
                    { icon: Zap, label: "Wiring Kits" },
                    { icon: Cpu, label: "Smart Devices" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-[var(--color-card-bg)] rounded-xl p-4 border border-[var(--color-card-border)] hover:border-[var(--color-accent)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <item.icon className="w-6 h-6 text-[var(--color-accent)] mx-auto mb-2" />
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button className="btn-primary">
                    Notify Me <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                  <Link
                    href="/shop"
                    className="btn-secondary"
                  >
                    Preview Store
                  </Link>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-[var(--color-muted)]">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
                    Quality Guaranteed
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
                    Fast Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
                    Expert Support
                  </span>
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
                Empowering Kenya with Reliable Electrical Solutions
              </h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                SunSea Electrical is a premier electrical engineering company dedicated
                to delivering high-quality installations, maintenance, and energy solutions.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                With a team of licensed engineers and a commitment to safety, we serve
                residential, commercial, and industrial clients across Kenya.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: Leaf,
                  title: "Our Mission",
                  desc: "To deliver safe, reliable, and sustainable electrical solutions that power progress.",
                },
                {
                  icon: TrendingUp,
                  title: "Our Vision",
                  desc: "To be East Africa's most trusted electrical engineering partner.",
                },
                {
                  icon: Users,
                  title: "Core Values",
                  desc: "Safety, Integrity, Quality, Innovation, Customer Focus, Sustainability.",
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
              Comprehensive Electrical Solutions
            </h2>
            <p className="text-[var(--color-muted)] mt-3">
              From installation to maintenance, we provide end-to-end electrical services
              tailored to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="card p-6 card-hover group"
              >
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
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">The SunSea Difference</h2>
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
              <div
                key={index}
                className="card p-6 text-center card-hover group"
              >
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
              Explore some of our recent electrical projects across Kenya.
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
            <h2 className="heading-lg text-[var(--color-primary)] mt-2">How We Work</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {["Consultation", "Site Survey", "Quotation", "Installation", "Testing", "Support"].map(
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
          <h2 className="heading-lg">Need Reliable Electrical Services?</h2>
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
                  <option>Electrical Installation</option>
                  <option>Solar Power</option>
                  <option>Maintenance</option>
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
                { icon: Mail, title: "Email", content: "sunseaelectrical@gmail.com" },
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
                  title="SunSea Electrical Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}