"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Bell, 
  CheckCircle, 
  Truck, 
  Shield, 
  Clock, 
  Sun, 
  Battery, 
  Zap, 
  Cpu,
  Search,
  Filter,
  Star,
  Heart,
  ChevronDown
} from "lucide-react";
import Reveal from "../components/Reveal";

const products = [
  {
    id: 1,
    name: "MGB 3-Phase Series 9",
    category: "Switchgear",
    price: 4280,
    sku: "SSE-MCB-893",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: "Solar Inverter 5kW Hybrid",
    category: "Solar",
    price: 84500,
    sku: "SSE-SOL-5000",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 18,
  },
  {
    id: 3,
    name: "Industrial LED Highbay 150W",
    category: "Lighting",
    price: 6920,
    sku: "SSE-LED-150",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 31,
  },
  {
    id: 4,
    name: "Modular Control Panel",
    category: "Panels",
    price: 1420000,
    sku: "SSE-PNL-MCP",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviews: 12,
  },
  {
    id: 5,
    name: "Solar Battery 200Ah Gel",
    category: "Solar",
    price: 42000,
    sku: "SSE-BAT-200",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 15,
  },
  {
    id: 6,
    name: "Distribution Board 12-Way",
    category: "Panels",
    price: 6500,
    sku: "SSE-DB-12",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.5,
    reviews: 8,
  },
];

const categories = ["All", "Switchgear", "Solar", "Lighting", "Panels", "Batteries"];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="section-padding section-alt min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <Reveal>
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-[#f9ad07] transition-all duration-300 hover:scale-[1.05] active:scale-95 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="heading-lg text-[#00255e] dark:text-white">SunSea Store</h1>
              <span className="badge badge-highlight text-sm">Coming Soon</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Premium electrical equipment and solar solutions delivered to your doorstep.
            </p>
          </div>
        </Reveal>

        {/* Search & Filter */}
        <Reveal delay={0.08}>
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 transition-all duration-300 hover:border-[#f9ad07]/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.05] active:scale-95 ${
                    activeCategory === cat
                      ? "bg-[#f9ad07] text-[#00255e] shadow-lg shadow-[#f9ad07]/30"
                      : "bg-white dark:bg-[#1a1f2e] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#f9ad07]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.06}>
              <div className="card overflow-hidden hover-lift group border border-gray-100 dark:border-gray-800 h-full transition-all duration-300 hover:border-[#f9ad07] product-card">
                <div className="relative h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 px-2 py-1 bg-[#f9ad07] text-[#00255e] text-xs font-bold rounded-lg transition-all duration-300 group-hover:scale-105">
                    {product.category}
                  </span>
                  <button className="absolute top-3 left-3 p-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-[#f9ad07] transition-all duration-300 hover:scale-110 active:scale-90">
                    <Heart className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-white transition-colors duration-300" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-[#f9ad07] mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({product.reviews})</span>
                  </div>
                  <h3 className="font-semibold text-[#00255e] dark:text-white text-sm line-clamp-2 group-hover:text-[#f9ad07] transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.sku}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-lg font-bold text-[#f9ad07]">
                      KES {product.price.toLocaleString()}
                    </span>
                    <button className="px-3 py-1.5 bg-[#f9ad07] text-[#00255e] rounded-lg text-xs font-semibold transition-all duration-300 hover:bg-[#e09c00] hover:scale-[1.05] active:scale-95 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Reveal>
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-all duration-300 hover:scale-110" />
              <h3 className="text-xl font-bold text-[#00255e] dark:text-white">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter.</p>
            </div>
          </Reveal>
        )}

        {/* Why Shop With Us */}
        <div className="mt-16">
          <Reveal>
            <h2 className="heading-md text-[#00255e] dark:text-white text-center mb-8">Why Shop With SunSea</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Quality Guaranteed", desc: "All products are sourced from trusted manufacturers" },
              { icon: Truck, title: "Fast Delivery", desc: "Nationwide delivery with real-time tracking" },
              { icon: Clock, title: "Expert Support", desc: "Technical support available 7 days a week" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="card p-6 text-center hover-lift border border-gray-100 dark:border-gray-800 h-full transition-all duration-300 hover:border-[#f9ad07]">
                  <div className="w-14 h-14 bg-[#f9ad07]/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-[#f9ad07]">
                    <item.icon className="w-7 h-7 text-[#f9ad07] transition-colors duration-300 group-hover:text-[#00255e]" />
                  </div>
                  <h3 className="font-semibold text-[#00255e] dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}