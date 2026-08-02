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
  { name: "Gallery", href: "/gallery" },
  { name: "Shop", href: "/shop" },
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
          ? "bg-white/95 dark:bg-[#0a0e1a]/95 backdrop-blur-2xl shadow-lg border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
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
              <span className={`text-sm md:text-base font-bold tracking-tight ${
                scrolled ? "text-[#00255e] dark:text-white" : "text-[#00255e] dark:text-white"
              }`}>
                SunSea
              </span>
              <span className="text-[8px] md:text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                Electrical
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-300 relative group tracking-wide ${
                  scrolled 
                    ? "text-gray-700 dark:text-gray-300 hover:text-[#f9ad07]" 
                    : "text-gray-700 dark:text-gray-300 hover:text-[#f9ad07]"
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#f9ad07] rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300"
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
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[#00255e] dark:text-white border-2 border-[#f9ad07] rounded-xl hover:bg-[#f9ad07] hover:text-[#00255e] transition-all duration-300 text-sm font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop
            </Link>
            <Link href="/#contact" className="btn-primary text-sm py-2.5 px-6">
              Get Quote
            </Link>
          </div>

          {/* Mobile Right */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300"
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
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0a0e1a] backdrop-blur-2xl border-t border-gray-200 dark:border-gray-800 transition-all duration-300">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-3.5 px-4 text-gray-700 dark:text-gray-300 hover:text-[#f9ad07] hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/shop"
              className="block py-3.5 px-4 text-[#00255e] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all font-semibold flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="w-4 h-4" />
              Shop
            </Link>
            <Link
              href="/#contact"
              className="block w-full text-center py-3.5 bg-[#f9ad07] text-[#00255e] rounded-xl hover:bg-[#e09c00] transition-all font-semibold mt-2"
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