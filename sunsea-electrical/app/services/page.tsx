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
  ShieldCheck,
  Settings,
  Home,
  Hotel,
  Heart,
  GraduationCap,
  Landmark,
  Users,
  Cpu,
  CheckCircle,
  Clock,
  Award,
  Wrench,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Reveal from "../components/Reveal";

// Service Categories
const serviceCategories = [
  {
    id: "industrial",
    icon: Zap,
    title: "Industrial Power Systems",
    description: "Complete power solutions for industrial facilities",
    features: [
      "MV/LV switchgear installation and maintenance",
      "Power distribution and motor control centers",
      "Substation engineering and construction",
      "Power quality analysis and correction",
      "Emergency power backup systems",
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "solar",
    icon: Sun,
    title: "Solar Energy Solutions",
    description: "Sustainable solar power for homes and businesses",
    features: [
      "Rooftop solar PV installation",
      "Ground-mount solar farms",
      "Hybrid solar with battery storage",
      "Solar water heating systems",
      "EPC and project management",
    ],
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "generator",
    icon: Battery,
    title: "Generator Systems",
    description: "Reliable backup power for any application",
    features: [
      "Diesel generator installation",
      "Gas generator systems",
      "Hybrid generator solutions",
      "Synchronization and grid paralleling",
      "Automatic transfer switches",
    ],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "smart",
    icon: Cpu,
    title: "Smart Building Systems",
    description: "Intelligent automation for modern buildings",
    features: [
      "IoT-enabled lighting control",
      "Building management systems",
      "Smart security and access control",
      "Climate and HVAC automation",
      "Energy monitoring and optimization",
    ],
    image: "https://images.unsplash.com/photo-1497366811357-4f8f0f7c6f0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cctv",
    icon: ShieldCheck,
    title: "CCTV & Networking",
    description: "Security and connectivity solutions",
    features: [
      "IP and analog CCTV installation",
      "Network infrastructure design",
      "Structured cabling systems",
      "Security monitoring centers",
      "Remote surveillance solutions",
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "maintenance",
    icon: Settings,
    title: "Maintenance Contracts",
    description: "Comprehensive maintenance and support",
    features: [
      "Routine inspection and testing",
      "Preventive maintenance programs",
      "24/7 emergency repair service",
      "Equipment replacement and upgrades",
      "Performance optimization",
    ],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

// Industries Served
const industries = [
  { icon: Building, title: "Commercial", desc: "Office buildings, malls, and retail spaces" },
  { icon: Factory, title: "Industrial", desc: "Manufacturing plants and warehouses" },
  { icon: Home, title: "Residential", desc: "Homes, apartments, and gated communities" },
  { icon: Hotel, title: "Hospitality", desc: "Hotels, resorts, and restaurants" },
  { icon: Heart, title: "Healthcare", desc: "Hospitals, clinics, and medical facilities" },
  { icon: GraduationCap, title: "Education", desc: "Schools, universities, and training centers" },
  { icon: Landmark, title: "Government", desc: "Public buildings and infrastructure" },
  { icon: Users, title: "Religious", desc: "Churches, mosques, and community centers" },
];

// Why Choose Us
const whyChooseUs = [
  { icon: Award, title: "10+ Years Experience", desc: "Trusted by Kenya's leading organizations" },
  { icon: Users, title: "Expert Team", desc: "Certified engineers and technicians" },
  { icon: Wrench, title: "Quality Workmanship", desc: "ISO-aligned practices and standards" },
  { icon: Clock, title: "24/7 Support", desc: "Emergency services always available" },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#00255e] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.05) 80px, rgba(255,255,255,0.05) 81px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.05) 80px, rgba(255,255,255,0.05) 81px)
            `
          }} />
        </div>
        <div className="container-custom relative z-10 pt-20 md:pt-28 pb-12 md:pb-16">
          <Reveal direction="right">
            <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
              <Link href="/" className="hover:text-[#f9ad07] transition-colors duration-300">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white">Services</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Our <span className="text-[#f9ad07]">Services</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 mt-3 max-w-2xl">
              Comprehensive electrical engineering solutions for every sector.
              From industrial power to smart buildings, we deliver excellence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-primary">What We Do</span>
            <h2 className="heading-lg text-[#00255e] dark:text-white mt-3">
              Complete Electrical <span className="text-[#f9ad07]">Solutions</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              We provide end-to-end electrical services for residential, commercial, and industrial clients.
            </p>
          </Reveal>

          <div className="space-y-16">
            {serviceCategories.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.08}>
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                  {/* Image */}
                  <div className="lg:w-1/2 w-full">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 group">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={800}
                        height={500}
                        className="w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-white font-semibold text-lg">{service.title}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2 w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#f9ad07]/10 flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-6 h-6 text-[#f9ad07]" />
                      </div>
<h3 className="text-2xl font-bold text-[#f9ad07] dark:text-white">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2.5">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-5 h-5 text-[#f9ad07] flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold text-sm hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
                    >
                      Get a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
                {index < serviceCategories.length - 1 && (
                  <div className="border-t border-gray-200 dark:border-gray-800 my-12" />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section-padding bg-page-alt">
        <div className="container-custom">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-accent">Industries</span>
            <h2 className="heading-lg text-[#00255e] dark:text-white mt-3">
              Sectors We <span className="text-[#f9ad07]">Serve</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Our expertise spans across multiple industries and sectors.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 hover:border-[#f9ad07] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <div className="w-14 h-14 mx-auto mb-3 bg-[#f9ad07]/10 rounded-xl flex items-center justify-center group-hover:bg-[#f9ad07] transition-colors duration-300">
                    <industry.icon className="w-7 h-7 text-[#f9ad07] group-hover:text-[#00255e] transition-colors duration-300" />
                  </div>
<h3 className="font-semibold text-[#f9ad07] dark:text-white text-sm">{industry.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{industry.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge badge-primary">Why Us</span>
            <h2 className="heading-lg text-[#00255e] dark:text-white mt-3">
              Why Choose <span className="text-[#f9ad07]">SunSea</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3">
              We combine expertise, quality, and reliability in every project.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Reveal key={index} delay={index * 0.08}>
                <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 hover:border-[#f9ad07] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#f9ad07]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#f9ad07] transition-colors duration-300">
                    <item.icon className="w-8 h-8 text-[#f9ad07] group-hover:text-[#00255e] transition-colors duration-300" />
                  </div>
<h3 className="font-bold text-[#f9ad07] dark:text-white text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#00255e] text-white">
        <div className="container-custom text-center">
          <Reveal>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-white/80 text-base md:text-lg mb-8">
                Contact us today for a free consultation and quote.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold hover:scale-[1.02] active:scale-[0.98]"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}