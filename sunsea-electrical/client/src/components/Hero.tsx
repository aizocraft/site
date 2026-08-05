'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Zap,
  Sun,
  CheckCircle2
} from 'lucide-react';
import Counter from './Counter';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Stats data
  const stats = [
    { value: 500, suffix: '+', label: 'Projects', icon: Zap },
    { value: 100, suffix: '+', label: 'Solar Projects', icon: Sun },
    { value: 100, suffix: '%', label: 'Satisfaction', icon: CheckCircle2 }
  ];

  return (
    <>
      <section 
        ref={heroRef} 
        className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-gray-950"
      >
        {/* Right side image */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0">
          <img 
            src="/poster.png" 
            alt="SunSea Electrical - Electrical Engineering"
            className="w-full h-full object-cover object-center"
          />
{/* Soft solid overlay for blending on mobile */}
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/80 lg:bg-white/40 dark:lg:bg-gray-950/40" />
        </div>

        {/* Subtle decorative orbs - solid faint colors, no gradients */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-24 w-72 h-72 bg-[#0089d1]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 4 }}
            className="absolute -right-24 bottom-1/4 w-72 h-72 bg-[#ffac10]/10 rounded-full blur-3xl"
          />
        </div>

        {/* Content - Left side */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#0089d1]" />
              <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
                Trusted Electrical Contractor
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-5 leading-tight tracking-tight"
            >
              SunSea{' '}
              <span className="text-[#0089d1] dark:text-[#009dff]">
                Electrical
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8"
            >
              Powering infrastructure through precision engineering — from substations to solar plants, from the panel board to the cloud.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-4 mb-10 sm:mb-14"
            >
              <Link href="/products">
                <motion.button 
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-4 bg-[#0089d1] text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button 
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-4 bg-[#ffac10] text-gray-900 font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Quote
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 sm:gap-10"
            >
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#0089d1] dark:text-[#009dff]" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        <Counter end={stat.value} duration={2} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
