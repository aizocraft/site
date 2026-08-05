'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin 
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

      {/* Contact Section - replaces old CTA */}
      <section className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-slate-50 dark:bg-gray-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0089d1]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffac10]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Get In{' '}
              <span className="text-[#0089d1] dark:text-[#009dff]">
                Touch
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Reach out to our expert team for reliable electrical and energy solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-[#0089d1] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Location</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kianjokoma
                <br />
                Embu, Kenya
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-[#ffac10] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Phone size={24} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Call Us</h3>
              <a
                href="tel:0784909466"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0089d1] dark:hover:text-[#009dff] transition-colors"
              >
                0784 909 466
              </a>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-[#ffac10] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Mail size={24} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Email</h3>
              <a
                href="mailto:sunseaelectrical@gmail.com"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0089d1] dark:hover:text-[#009dff] transition-colors break-all"
              >
                sunseaelectrical@gmail.com
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0089d1] hover:bg-[#0077b5] text-white font-bold text-base sm:text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Contact Our Experts
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              Mon-Sat•8:00 AM - 6:00 PM
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
