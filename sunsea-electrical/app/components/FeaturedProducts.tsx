"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Star, Zap, Sun, Battery, Cpu } from "lucide-react";
import Reveal from "./Reveal";

const products = [
  {
    icon: Zap,
    name: "MGB 3-Phase Series 9",
    category: "Switchgear",
    price: "KES 4,280",
    sku: "SSE-MCB-893",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    icon: Sun,
    name: "Solar Inverter 5kW Hybrid",
    category: "Solar",
    price: "KES 84,500",
    sku: "SSE-SOL-5000",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    icon: Battery,
    name: "Industrial LED Highbay 150W",
    category: "Lighting",
    price: "KES 6,920",
    sku: "SSE-LED-150",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    icon: Cpu,
    name: "Modular Control Panel",
    category: "Panels",
    price: "KES 1,420,000",
    sku: "SSE-PNL-MCP",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
];

export default function FeaturedProducts() {
  return (
    <section id="shop" className="section-padding bg-white dark:bg-[#0a0e1a]">
      <div className="container-custom">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="badge badge-highlight text-sm">Featured Products</span>
              <h2 className="heading-lg text-[#00255e] dark:text-white mt-2">Shop Our Top Sellers</h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#f9ad07] hover:text-[#00255e] transition-colors font-semibold self-start sm:self-auto"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <div className="card overflow-hidden hover-lift group border border-gray-100 dark:border-gray-800 h-full">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2 py-1 bg-[#f9ad07] text-[#00255e] text-xs font-bold rounded-lg">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-[#f9ad07] mb-1">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <h3 className="font-semibold text-[#00255e] dark:text-white text-sm line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.sku}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-lg font-bold text-[#f9ad07]">{product.price}</span>
                    <button className="px-3 py-1.5 bg-[#f9ad07] text-[#00255e] rounded-lg text-xs font-semibold hover:bg-[#e09c00] transition-colors flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

