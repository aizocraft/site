"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Reveal from "./Reveal";

const testimonials = [
  {
    name: "James Mwangi",
    company: "KCB Group",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "SunSea Electrical delivered exceptional service for our backup power system. Professional, on-time, and within budget. Highly recommended.",
  },
  {
    name: "Grace Akinyi",
    company: "Mombasa Solar Initiative",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "The solar farm project exceeded our expectations. SunSea's team demonstrated incredible expertise and dedication to clean energy.",
  },
  {
    name: "Peter Kamau",
    company: "Eldoret Manufacturers",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "Our industrial plant's electrical infrastructure was completed flawlessly. SunSea's automation solutions have significantly improved our production efficiency.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding bg-[#00255e] text-white">
      <div className="container-custom">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge bg-white/10 text-white border-white/20">Testimonials</span>
          <h2 className="heading-lg text-white mt-2">What Our Clients Say</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 relative transition-all duration-300 hover:border-white/20">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 transition-all duration-300 hover:scale-105">
                  <Image
                    src={testimonials[index].image}
                    alt={testimonials[index].name}
                    fill
                    className="rounded-full object-cover border-2 border-[#f9ad07]"
                  />
                </div>
                <div>
                  <p className="font-bold text-white">{testimonials[index].name}</p>
                  <p className="text-sm text-white/60">{testimonials[index].company}</p>
                  <div className="flex text-[#f9ad07] mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-lg leading-relaxed">
                "{testimonials[index].quote}"
              </p>
              <div className="flex justify-end mt-6 gap-2">
                <button
                  onClick={prev}
                  className="p-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="p-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}