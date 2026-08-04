"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  company: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "James Mwangi",
    company: "Greenpark Developers",
    quote:
      "Nenes Construction delivered our residential estate ahead of schedule. Exceptional craftsmanship, professional team, and flawless attention to detail. Highly recommended.",
  },
  {
    name: "Grace Akinyi",
    company: "Westside Properties",
    quote:
      "The commercial tower project exceeded our expectations. Nenes's engineers demonstrated incredible expertise and commitment to quality construction.",
  },
  {
    name: "Peter Kamau",
    company: "Eldoret Industries",
    quote:
      "Our industrial warehouse was completed flawlessly. Nenes's project management and structural expertise have significantly improved our operations.",
  },
];

export default function Testimonials() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () =>
    setTestimonialIndex((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () =>
    setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="section-padding bg-[var(--color-cta-bg)] text-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="badge bg-white/10 text-white border-white/20">Testimonials</span>
          <h2 className="heading-lg text-white mt-2">What Our Clients Say</h2>
          <p className="text-white/60 mt-3">Real feedback from our valued clients</p>
        </div>
        <div className="max-w-3xl mx-auto reveal">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 relative hover:bg-white/10 transition-all duration-300">
            <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="/testimonialimage.png"
                  alt={testimonials[testimonialIndex].name}
                  fill
                  className="rounded-full object-cover border-2 border-white/20"
                />
              </div>
              <div>
                <p className="font-bold text-white">{testimonials[testimonialIndex].name}</p>
                <p className="text-sm text-white/60">{testimonials[testimonialIndex].company}</p>
                <div className="flex text-[var(--color-highlight)] mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">
              &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
            </p>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-xl border border-white/20 hover:bg-white/10 hover:scale-105 transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-xl border border-white/20 hover:bg-white/10 hover:scale-105 transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}