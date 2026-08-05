'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Headphones,
  ThumbsUp,
  Zap,
  Sun
} from 'lucide-react';
import SplitText from './SplitText';
import Counter from './Counter';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Stats data
  const stats = [
    { value: 500, suffix: '+', label: 'Projects', icon: Zap, duration: 2 },
    { value: 100, suffix: '+', label: 'Solar Projects', icon: Sun, duration: 2.5 },
    { value: 100, suffix: '%', label: 'Satisfaction', icon: ThumbsUp, duration: 2 }
  ];

  return (
    <>
      <section 
        ref={heroRef} 
        className="relative min-h-[85vh] md:min-h-[95vh] lg:min-h-[90vh] lg:mt-7 flex items-center overflow-hidden bg-white dark:bg-gray-950"
      >
        {/* Left Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Text Column - Left */}
            <div className="flex flex-col items-start text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full px-4 py-1.5 mb-6"
              >
                <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  Precision Electrical Engineering
                </span>
              </motion.div>

              {/* Animated Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="mb-4 sm:mb-6"
              >
                <SplitText
                  text="SunSea Electrical"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight"
                  delay={60}
                  duration={0.7}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 60 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                  onLetterAnimationComplete={() => {}} 
                />
              </motion.div>

              {/* Subtext */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-xl mb-8 sm:mb-10"
              >
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                  Powering infrastructure through precision engineering — from substations to solar plants, from the panel board to the cloud.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 mb-10 sm:mb-12"
              >
                {/* Shop Now - Solid */}
                <Link href="/products">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-6 sm:px-9 py-3 sm:py-4 bg-[#0089d1] text-white font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Shop Now
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>

                {/* Get Quote - Outline */}
                <Link href="/contact">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative px-6 sm:px-9 py-3 sm:py-4 font-semibold text-sm sm:text-base rounded-full border-2 border-[#0089d1] text-[#0089d1] dark:text-blue-400 dark:border-blue-400 transition-all duration-300 group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Quote
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-6 sm:gap-12 max-w-xl w-full"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="text-left"
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                      <Counter end={stat.value} duration={stat.duration} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Image Column - Right */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                <img 
                  src="/poster.png" 
                  alt="SunSea Electrical - Electrical Engineering"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 hidden sm:block"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-9 sm:w-7 sm:h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex flex-col items-center justify-start pt-1.5 sm:pt-2 hover:border-[#0089d1] transition-colors"
          >
            <motion.div 
              animate={{ height: [4, 8, 4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 bg-[#0089d1] rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
