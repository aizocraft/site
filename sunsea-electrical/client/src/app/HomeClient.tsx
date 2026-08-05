'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import Services from '@/components/Services';
import Features from '@/components/Features';

const whyUs = [
  "We offer affordable electrical and energy solutions that help you save more.",
  "Every project we undertake ensures expectations are met, backed by vast experience.",
  "Cutting-edge technology and expert installation make going solar simple, so you start saving immediately.",
  "Highly trained, skilled engineers who will never sacrifice quality in any installation or service.",
];

export default function HomeClient() {
  // Featured products query
  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ featured: true, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <Hero />

      {/* About Section - after hero */}
      <section className="py-20 sm:py-24 lg:py-28 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image - original size, not cropped */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
                <img
                  src="/banner.png"
                  alt="SunSea Electrical - About Us"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="hidden lg:flex absolute -bottom-6 -right-6 bg-[#0089d1] text-white rounded-2xl px-6 py-4 shadow-lg">
                <div>
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-xs font-medium opacity-90">Years Experience</div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-px bg-[#0089d1]" />
                <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#0089d1] dark:text-[#009dff]">
                  Your Trusted Partner
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Meet SunSea{' '}
                <span className="text-[#0089d1] dark:text-[#009dff]">
                  Electrical
                </span>
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-base sm:text-lg">
                We are dedicated to providing reliable and cost-effective electrical and energy systems for homes, businesses, and industries across Kenya.
              </p>

              <div className="space-y-4 mb-8">
                {whyUs.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-3 items-start group"
                  >
                    <CheckCircle2 size={22} className="text-[#0089d1] dark:text-[#009dff] mt-0.5 shrink-0" />
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0089d1] hover:bg-[#0077b5] text-white font-semibold rounded-xl text-base transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Learn More About Us
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-7 py-3.5 bg-transparent border-2 border-gray-300 dark:border-gray-700 hover:border-[#0089d1] dark:hover:border-[#009dff] text-gray-700 dark:text-gray-300 hover:text-[#0089d1] dark:hover:text-[#009dff] font-semibold rounded-xl text-base transition-all duration-200"
                  >
                    Browse Products
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Services />

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-white dark:bg-gray-950">
        <div className="px-2 sm:px-4 lg:max-w-8xl lg:mx-auto lg:mx-4 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 max-w-full"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Shop Now
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Featured Products
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Trusted electrical and energy equipment for your projects
              </p>
            </div>

            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Products
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {featuredData?.products?.slice(0, 5).map((product: any, index: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-0"
              >
                <ProductCard product={product} />
              </motion.div>
            )) ||
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-80"
                />
              ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/products">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-all duration-300">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Features />

{/* Call To Action Section */}
      <section className="relative py-20 sm:py-24 lg:py-28 overflow-hidden">
<div className="absolute inset-0 bg-[#003d66] dark:bg-[#005a99]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, -40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 4 }}
            className="absolute -right-24 bottom-1/4 w-96 h-96 bg-[#ffac10]/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-white/90 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <Zap className="w-4 h-4" />
              Ready to Power Your Project?
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-5 leading-tight">
              Let's Build Something{' '}
              <span className="text-[#ffac10]">Electric</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-blue-50/90 max-w-2xl mx-auto leading-relaxed mb-10">
              Get a free consultation and expert guidance from our team. Whether it's solar, electrical installations, or energy solutions — we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0066a8] hover:bg-[#ffac10] hover:text-gray-900 font-bold text-base sm:text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Get a Free Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>

              <a
                href="tel:0784909466"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white/70 hover:border-white text-white hover:bg-white/10 font-bold text-base sm:text-lg rounded-xl transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Call 0784 909 466
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-10 text-blue-50/80 text-sm">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ffac10]" />
                Free Consultation
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ffac10]" />
                Expert Engineers
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ffac10]" />
                Quality Guaranteed
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
