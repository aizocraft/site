"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-nav-bg-scrolled)] backdrop-blur-2xl shadow-lg border-b border-[var(--color-nav-border)]"
          : "bg-[var(--color-nav-bg)] backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with favicon + text */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/favicon.png"
                alt="SunSea Electrical"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm md:text-base font-bold text-[var(--color-foreground)] tracking-tight">
                SunSea
              </span>
              <span className="text-[8px] md:text-[10px] font-medium text-[var(--color-muted)] tracking-widest uppercase">
                Electrical
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors duration-300 relative group tracking-wide"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[var(--color-accent)] rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--color-nav-toggle-bg)] hover:bg-[var(--color-nav-toggle-hover)] text-[var(--color-nav-icon)] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[#00255e] dark:text-[var(--color-highlight)] border-2 border-[var(--color-highlight)] rounded-xl hover:bg-[var(--color-highlight)] hover:text-[#00255e] transition-all duration-300 text-sm font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop
              <span className="ml-1 px-2 py-0.5 bg-[var(--color-highlight)] text-[#00255e] rounded-full text-[10px] font-bold">
                Soon
              </span>
            </Link>
            <Link href="/#contact" className="btn-primary text-sm py-2.5 px-6">
              Get Quote
            </Link>
          </div>

          {/* Mobile Right */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--color-nav-toggle-bg)] hover:bg-[var(--color-nav-toggle-hover)] text-[var(--color-nav-icon)] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[var(--color-foreground)] hover:bg-[var(--color-nav-toggle-hover)] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-[var(--color-nav-bg-scrolled)] backdrop-blur-2xl border-t border-[var(--color-nav-border)] transition-all duration-300">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-3.5 px-4 text-[var(--color-foreground)] hover:text-[var(--color-accent)] hover:bg-[var(--color-nav-toggle-bg)] rounded-xl transition-all font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/shop"
              className="block py-3.5 px-4 text-[#00255e] dark:text-[var(--color-highlight)] hover:bg-[var(--color-nav-toggle-bg)] rounded-xl transition-all font-semibold flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="w-4 h-4" />
              Shop
              <span className="ml-auto px-3 py-1 bg-[var(--color-highlight)] text-[#00255e] rounded-full text-xs font-bold">
                Coming Soon
              </span>
            </Link>
            <Link
              href="/#contact"
              className="block w-full text-center py-3.5 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-all font-semibold mt-2"
              onClick={() => setIsOpen(false)}
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

