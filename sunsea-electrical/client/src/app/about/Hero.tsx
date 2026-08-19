// app/about/Hero.tsx
'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Phone,
  Mail,
  Eye,
  Target,
  ArrowRight,
  Download,
  Loader2,
} from 'lucide-react';

interface HeroProps {
  onOpenProfile: () => void;
}

const stagger = (i: number, base = 0.08) => ({ delay: i * base });

export default function Hero({ onOpenProfile }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const indicatorY = useTransform(scrollY, [0, 150], [0, 20]);

  const opacity = useTransform(scrollY, [0, 300], [1, 0.95]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.98]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/profile.pdf');
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'SunSea_Electrical_Profile.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      setDownloadProgress(0);
      alert('Download failed. Please try again later.');
    }
  };

  const cards = useMemo(
    () => [
      {
        icon: Eye,
        label: 'Vision',
        text: "To be East Africa's most trusted electrical engineering partner, leading the region's transition to smart, clean, and resilient energy infrastructure.",
      },
      {
        icon: Target,
        label: 'Mission',
        text: "To deliver reliable, innovative, and sustainable electrical solutions that empower homes, businesses, and industries—ensuring safety, efficiency, and uninterrupted power for every client we serve.",
      },
    ],
    []
  );

  if (!mounted) return null;

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#00225c] dark:bg-[#001a4a]">
      {/* Background Image - Hidden on mobile, visible on desktop */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <img
          src="/banner.png"
          alt="SunSea Electrical banner"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Responsive overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00225c]/95 via-[#00225c]/70 to-[#00225c]/40 dark:from-[#001a4a]/95 dark:via-[#001a4a]/70 dark:to-[#001a4a]/40" />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/30" />
      </div>

      {/* Mobile background - solid color with subtle gradient */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-br from-[#00225c] to-[#003a8a] dark:from-[#001a4a] dark:to-[#00225c]" />

      {/* Decorative elements for mobile */}
      <div className="absolute inset-0 md:hidden overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0089d1]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00c2ff]/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, scale }}
        className="container mx-auto px-4 sm:px-6 lg:px-20 relative z-10 pt-8 pb-16 md:pt-4 md:pb-24"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow Section */}
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 sm:w-12 h-px bg-[#00c2ff]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#00c2ff]">
              Since 2010
            </span>
            <div className="w-8 sm:w-12 h-px bg-[#00c2ff]" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="font-bold leading-[1.15] sm:leading-[1.2] mb-4 sm:mb-6 text-white"
            style={{
              fontSize: 'clamp(2rem, 7vw, 4.5rem)',
              letterSpacing: '-0.02em',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Engineering
            <br />
            <span className="text-[#00c2ff] inline-block mt-1 sm:mt-2">
              Excellence
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80 dark:text-white/85 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            SunSea Electrical delivers comprehensive, ISO-standard engineering for power and energy
            challenges across the region.
          </motion.p>

          {/* CTA Actions */}
          <motion.div
            className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
          >
            {/* Primary CTA - Download Button */}
            <div className="relative w-full sm:w-auto">
              <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold text-sm text-white bg-[#0089d1] hover:bg-[#009dff] transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={!isDownloading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isDownloading ? { scale: 0.98 } : {}}
              >
                {isDownloading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    <span>Downloading... {downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download size={17} strokeWidth={1.8} />
                    <span>Download Company Profile</span>
                    <ArrowRight size={15} className="hidden sm:inline group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </motion.button>

              {/* Progress Bar */}
              {isDownloading && (
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full bg-[#00c2ff] rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${downloadProgress}%` }}
                  />
                </motion.div>
              )}
            </div>

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block w-px h-6 bg-white/30" />

            {/* Contact Icons */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
              <motion.a
                href="tel:+254728749722"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/25 hover:bg-white hover:text-[#00225c] transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone size={13} className="text-[#00c2ff]" />
                <span className="text-[10px] sm:text-xs font-medium text-white hidden xs:inline">+254 728 749 722</span>
              </motion.a>

              <motion.a
                href="mailto:sunseaelectrical@gmail.com"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 border border-white/25 hover:bg-white hover:text-[#00225c] transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail size={13} className="text-[#00c2ff]" />
                <span className="text-[10px] sm:text-xs font-medium text-white hidden sm:inline">Email Us</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Vision & Mission Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  className="group relative rounded-xl p-4 sm:p-6 bg-white/95 dark:bg-gray-900/95 border border-white/30 dark:border-gray-700/30 hover:border-[#00c2ff] transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={stagger(i, 0.1)}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#0089d1] flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#0089d1]">
                          {card.label}
                        </p>
                        <p className="text-gray-900 dark:text-white font-bold text-sm sm:text-base leading-tight">
                          Our {card.label}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300 text-left">
                      {card.text}
                    </p>

                    <div className="mt-3 sm:mt-4 h-px w-8 sm:w-12 bg-[#00c2ff] group-hover:w-12 sm:group-hover:w-20 transition-all duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="hidden md:flex absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 sm:gap-3 pointer-events-none"
        style={{
          opacity: indicatorOpacity,
          y: indicatorY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/70">
          Scroll Down
        </span>

        <div className="w-6 h-10 sm:w-7 sm:h-12 border-2 border-[#00c2ff]/80 rounded-full flex justify-center p-1">
          <motion.div
            className="w-1 h-2.5 sm:h-3 rounded-full bg-[#00c2ff]"
            animate={{
              y: [0, 14, 0],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>

      {/* Bottom Wave - Simplified for mobile */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-12 sm:h-16 md:h-20">
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,53.3C672,53,768,75,864,80C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="fill-white dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>
  );
}