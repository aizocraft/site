"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Zap,
  Sun,
  Battery,
  Building,
  Factory,
  ClipboardCheck,
  Settings,
  ShieldCheck,
  Shield,
  Award,
  Home,
  Hotel,
  Heart,
  GraduationCap,
  Landmark,
  Leaf,
  Users,
  Cpu,
  Eye,
  Target,
} from "lucide-react";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import FeaturedProducts from "./components/FeaturedProducts";
import Reveal from "./components/Reveal";

// Services Data
const services = [
  {
    icon: Zap,
    title: "Industrial Power Systems",
    desc: "MV/LV switchgear, distribution, motor control, and substation engineering."
  },
  {
    icon: Sun,
    title: "Solar Energy Solutions",
    desc: "Rooftop, ground-mount, and hybrid PV with battery storage and EPC delivery."
  },
  {
    icon: Battery,
    title: "Generator Systems",
    desc: "Diesel, gas, and hybrid gensets with synchronisation and grid paralleling."
  },
  {
    icon: Cpu,
    title: "Smart Building Systems",
    desc: "IoT-enabled lighting, security, and climate control for modern buildings."
  },
  {
    icon: ShieldCheck,
    title: "CCTV & Networking",
    desc: "Comprehensive security systems and structured cabling for enterprise networks."
  },
  {
    icon: Settings,
    title: "Maintenance Contracts",
    desc: "Regular maintenance and emergency repair services for all electrical systems."
  },
];

const processSteps = [
  { number: 1, title: "Consultation", desc: "We discuss your project requirements and goals." },
  { number: 2, title: "Site Survey", desc: "Our engineers assess your site and existing systems." },
  { number: 3, title: "Design & Quotation", desc: "We design the solution and provide a detailed quote." },
  { number: 4, title: "Installation", desc: "Professional installation by certified technicians." },
  { number: 5, title: "Testing & Commissioning", desc: "Comprehensive testing to ensure optimal performance." },
  { number: 6, title: "Support & Maintenance", desc: "Ongoing support and maintenance services." },
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

const aboutHighlights = [
  { icon: Shield, title: "Quality Assured", desc: "ISO-aligned practices and certified engineers on every project." },
  { icon: Award, title: "10+ Years Experience", desc: "Trusted by Kenya's leading commercial and industrial clients." },
  { icon: Users, title: "Expert Team", desc: "In-house electrical, solar and automation specialists." },
  { icon: Leaf, title: "Sustainability Focus", desc: "Driving Kenya's clean energy transition responsibly." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section - SunSea style (full viewport width & height) */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-page-alt">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(0,0,0,0.1) 80px, rgba(0,0,0,0.1) 81px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(0,0,0,0.1) 80px, rgba(0,0,0,0.1) 81px)
            `
          }} />
        </div>

        <div className="w-full relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-[100rem] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <Reveal direction="right" className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#00255e] text-white rounded-full text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Engineered Infrastructure Since 2010
                </span>
              </div>

<h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-[#00255e] dark:text-[#f9ad07] leading-[1.1]">
                {" "}
                <span className="text-[#00255e] dark:text-[#f9ad07]">Powering Infrastructure Through Precision Engineering</span>
              </h1>

              <p className="text-lg md:text-xl text-[#008ad2] dark:text-gray-300 leading-relaxed max-w-xl">
                A full-service electrical engineering practice — from substations to solar plants,
                from the panel board to the cloud.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#services"
                  className="inline-flex items-center px-8 py-3.5 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold text-base shadow-xl shadow-[#f9ad07]/30 hover:shadow-[#f9ad07]/50 hover:-translate-y-1 transition-all duration-300 group"
                >
                  Explore Solutions
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center px-8 py-3.5 bg-white dark:bg-[#1a1f2e] text-[#00255e] dark:text-white border-2 border-[#00255e] dark:border-gray-600 rounded-xl hover:border-[#f9ad07] hover:text-[#f9ad07] transition-all duration-300 font-semibold text-base"
                >
                  Request Consultation
                </Link>
              </div>
            </Reveal>

            {/* Right Image - full size, no cropping */}
            <Reveal direction="left" delay={0.15}>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-surface">
                  <Image
                    src="/banner.png"
                    alt="Electrical engineering"
                    width={1400}
                    height={1050}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* About Section - Mission & Vision with poster.png (full height image right) */}
      <section id="about" className="relative w-full bg-page py-16 md:py-24 lg:py-28">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[100rem] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            {/* Left - Mission & Vision Text */}
            <div className="flex flex-col justify-center">
              <Reveal direction="right">
                <span className="badge badge-primary">About SunSea</span>
                <h2 className="heading-lg text-[#00255e] dark:text-white mt-3">
                  Engineering Excellence, <span className="text-[#f9ad07]">Energizing Kenya</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg leading-relaxed">
                  SunSea Electrical is a full-service electrical engineering company delivering
                  safe, efficient and future-ready power solutions across Kenya since 2010.
                </p>
              </Reveal>

{/* Mission */}
              <Reveal direction="right" delay={0.1} className="mt-8">
                <div className="card p-6 md:p-7 hover-lift border border-gray-100 dark:border-gray-800 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#f9ad07]/10 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-[#f9ad07]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#00255e] dark:text-[#f9ad07]">Our Mission</h3>
                    <p className="text-sm md:text-base text-[#008ad2] dark:text-gray-300 mt-1.5 leading-relaxed">
                      To deliver reliable, innovative and sustainable electrical solutions that
                      empower homes, businesses and industries — ensuring safety, efficiency and
                      uninterrupted power for every client we serve.
                    </p>
                  </div>
                </div>
              </Reveal>

{/* Vision */}
              <Reveal direction="right" delay={0.2} className="mt-6">
                <div className="card p-6 md:p-7 hover-lift border border-gray-100 dark:border-gray-800 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#f9ad07]/10 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-[#f9ad07]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#00255e] dark:text-[#f9ad07]">Our Vision</h3>
                    <p className="text-sm md:text-base text-[#008ad2] dark:text-gray-300 mt-1.5 leading-relaxed">
                      To be East Africa&apos;s most trusted electrical engineering partner —
                      leading the region&apos;s transition to smart, clean and resilient energy
                      infrastructure.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {aboutHighlights.map((item, i) => (
                  <Reveal key={item.title} direction="right" delay={0.25 + i * 0.08}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#f9ad07]/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-[#f9ad07]" />
                      </div>
                      <div>
<p className="font-semibold text-[#00255e] dark:text-[#f9ad07] text-sm">{item.title}</p>
                        <p className="text-xs text-[#008ad2] dark:text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Right - Poster (full height & full size, no cropping) */}
            <Reveal direction="left" delay={0.15} className="h-full">
              <div className="relative h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[560px] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-surface p-3 sm:p-4 flex items-center justify-center">
                <Image
                  src="/poster.png"
                  alt="SunSea Electrical — Our Promise"
                  width={1000}
                  height={1200}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Section - A complete electrical practice under one roof */}
      <section id="services" className="section-padding bg-page-alt">
        <div className="container-custom">
<Reveal className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="heading-lg text-[#00255e] dark:text-[#f9ad07]">
              Our Services
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <div className="card p-6 hover-lift group border border-gray-100 dark:border-gray-800 h-full">
                  <div className="w-14 h-14 bg-[#f9ad07]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#f9ad07] transition-colors duration-300">
                    <service.icon className="w-7 h-7 text-[#f9ad07] group-hover:text-[#00255e] transition-colors duration-300" />
                  </div>
<h3 className="font-semibold text-[#00255e] dark:text-[#f9ad07] text-lg">{service.title}</h3>
                  <p className="text-sm text-[#008ad2] dark:text-gray-300 mt-1">{service.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Component */}
      <FeaturedProducts />

      {/* Process Section */}
      <section id="process" className="section-padding bg-page">
        <div className="container-custom">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-accent">Our Process</span>
            <h2 className="heading-lg text-[#00255e] dark:text-[#f9ad07] mt-2">How We Work</h2>
            <p className="text-[#008ad2] dark:text-gray-300 mt-3">A streamlined approach from consultation to completion</p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="text-center group h-full">
                  <div className="w-14 h-14 mx-auto bg-[#f9ad07] rounded-xl flex items-center justify-center text-[#00255e] font-bold text-xl mb-3 shadow-lg shadow-[#f9ad07]/20 group-hover:scale-110 transition-all duration-300">
                    {step.number}
                  </div>
<p className="text-sm font-semibold text-[#00255e] dark:text-[#f9ad07] ">{step.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section-padding bg-page-alt">
        <div className="container-custom">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-primary">Industries</span>
            <h2 className="heading-lg text-[#00255e] dark:text-[#f9ad07] mt-2">Serving Diverse Sectors</h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <div className="card p-6 text-center hover-lift group border border-gray-100 dark:border-gray-800 h-full">
                  <div className="w-14 h-14 mx-auto mb-3 bg-[#f9ad07]/10 rounded-xl flex items-center justify-center group-hover:bg-[#f9ad07] transition-colors duration-300">
                    <industry.icon className="w-7 h-7 text-[#f9ad07] group-hover:text-[#00255e] transition-colors duration-300" />
                  </div>
<p className="font-medium text-[#00255e] dark:text-[#f9ad07] text-sm">{industry.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="gallery" className="section-padding bg-page">
        <div className="container-custom">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-accent">Portfolio</span>
            <h2 className="heading-lg text-[#00255e] dark:text-[#f9ad07] mt-2">Featured Projects</h2>
            <p className="text-[#008ad2] dark:text-gray-300 mt-3">Explore some of our recent electrical projects across Kenya</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <div className="card overflow-hidden group hover-lift border border-gray-100 dark:border-gray-800 h-full">
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
<h3 className="font-bold text-[#00255e] dark:text-[#f9ad07] mt-2 group-hover:text-[#f9ad07] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.location}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="text-center mt-10">
            <Link href="/gallery" className="btn-primary">
              View All Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Testimonials Component */}
      <Testimonials />

      {/* Contact Component */}
      <Contact />
    </>
  );
}