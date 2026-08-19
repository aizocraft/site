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

  const stats = [
    { value: 500, suffix: '+', label: 'Projects', icon: Zap },
    { value: 100, suffix: '+', label: 'Solar Projects', icon: Sun },
    { value: 100, suffix: '%', label: 'Satisfaction', icon: CheckCircle2 }
  ];

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-[85vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* Background Image - Hidden on mobile, visible on desktop */}
      <div className="absolute inset-0 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-1/2 z-0 hidden lg:block">
        <img 
          src="/poster.png" 
          alt="SunSea Electrical - Electrical Engineering"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/75 lg:bg-white/30 dark:lg:bg-gray-950/40" />
      </div>

      {/* Mobile background - solid color with subtle pattern */}
      <div className="absolute inset-0 lg:hidden z-0 bg-gradient-to-br from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-950" />

      {/* Decorative elements - simplified for mobile */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-24 w-48 h-48 sm:w-72 sm:h-72 bg-[#0089d1]/5 dark:bg-[#0089d1]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], x: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 4 }}
          className="absolute -right-24 bottom-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-[#ffac10]/5 dark:bg-[#ffac10]/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100/50 dark:border-blue-800/30 rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-6 backdrop-blur-sm"
          >
            <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
              Trusted Electrical Contractor
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 leading-tight tracking-tight"
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
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0"
          >
            Powering infrastructure through precision engineering — from substations to solar plants, from the panel board to the cloud.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center lg:justify-start"
          >
            <Link href="/products">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#0089d1] text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#009dff]"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#ffac10] text-gray-900 font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#ffbb2e]"
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
            className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                  className="flex items-center gap-2 sm:gap-2.5 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-100/50 dark:border-gray-700/30"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0089d1] dark:text-[#009dff]" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      <Counter end={stat.value} duration={2} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
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
  );
}