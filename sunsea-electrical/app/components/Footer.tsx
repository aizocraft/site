"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Send,
  ArrowUp,
  ShieldCheck,
  Award,
  Users,
  Leaf,
} from "lucide-react";

const quickLinks = [
  { name: "About Us", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/#contact" },
];

const serviceLinks = [
  "Industrial Power Systems",
  "Solar Energy Solutions",
  "Generator Systems",
  "Smart Building Systems",
  "CCTV & Networking",
  "Maintenance Contracts",
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "ISO-Aligned" },
  { icon: Award, label: "10+ Years" },
  { icon: Users, label: "Expert Team" },
  { icon: Leaf, label: "Sustainability" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0f172a] dark:bg-[#050a15] text-white border-t border-gray-800/50 overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[320px] rounded-full bg-[#008ad2]/10 dark:bg-[#33a8e8]/10 blur-3xl" />

      <div className="container-custom relative pt-14 md:pt-20 pb-8">
        {/* Top row - brand + newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-10 border-b border-gray-800/60">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-11 h-11 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/favicon.png"
                  alt="SunSea Electrical"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg md:text-xl font-bold tracking-tight text-white">
                  SunSea
                </span>
                <span className="text-[9px] md:text-[10px] font-medium text-gray-400 tracking-widest uppercase">
                  Electrical
                </span>
              </div>
            </Link>
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800/70 border border-gray-700/60 text-[11px] font-medium text-gray-300 transition-all duration-300 hover:border-[#f9ad07]/50 hover:text-white"
                >
                  <badge.icon className="w-3 h-3 text-[#f9ad07]" />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#f9ad07]" />
              Subscribe to our newsletter
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Get the latest on solar energy, safety tips & product offers.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-sm text-green-400">
                <ShieldCheck className="w-4 h-4" />
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700/60 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#f9ad07] focus:ring-2 focus:ring-[#f9ad07]/20 transition-all duration-300 hover:border-gray-600"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#f9ad07] text-[#00255e] text-sm font-semibold transition-all duration-300 hover:bg-[#e09c00] hover:scale-[1.02] active:scale-95"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 py-10 md:py-12">
          {/* Company */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9ad07]" />
              About SunSea
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Powering Kenya with reliable electrical engineering since 2010. From
              substations to solar plants — excellence in every connection.
            </p>
            <div className="flex gap-2.5 mt-5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#f9ad07] transition-all duration-300 flex items-center justify-center text-gray-400 hover:text-[#00255e] hover:scale-110 active:scale-95"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9ad07]" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-[#f9ad07] transition-all duration-300"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9ad07]" />
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    href="/#services"
                    className="text-gray-400 hover:text-[#f9ad07] transition-colors duration-300 inline-block"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9ad07]" />
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#f9ad07]/20">
                  <MapPin className="w-4 h-4 text-[#f9ad07]" />
                </span>
                <span className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  Embu, Kenya
                  <br />
                  Kianjokoma Town
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#f9ad07]/20">
                  <Phone className="w-4 h-4 text-[#f9ad07]" />
                </span>
                <a
                  href="tel:+254700123456"
                  className="text-gray-400 text-xs md:text-sm hover:text-[#f9ad07] transition-colors duration-300"
                >
                  +2547 8490 9466
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#f9ad07]/20">
                  <Mail className="w-4 h-4 text-[#f9ad07]" />
                </span>
                <a
                  href="mailto:sunseaelectrical@gmail.com"
                  className="text-gray-400 text-xs md:text-sm hover:text-[#f9ad07] transition-colors duration-300 break-all"
                >
                  sunseaelectrical@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#f9ad07]/20">
                  <Clock className="w-4 h-4 text-[#f9ad07]" />
                </span>
                <span className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  Mon-Fri: 8AM - 6PM
                  <br />
                  Sat: 9AM - 5PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs md:text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} SunSea Electrical. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-[#f9ad07] hover:text-[#00255e] text-gray-300 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

