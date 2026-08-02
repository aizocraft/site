"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

interface ContactItem {
  icon: React.ElementType;
  title: string;
  content: string;
}

const contactItems: ContactItem[] = [
  { icon: MapPin, title: "Location", content: "Nairobi, Kenya" },
  { icon: Phone, title: "Phone", content: "24/7: +2547 1778 0056" },
  { icon: Mail, title: "Email", content: "nenesconstruction@gmail.com" },
];

export default function Contact() {
  return (
    <section id="contact" className="section-padding section-alt">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="badge badge-primary">Contact</span>
          <h2 className="heading-lg text-[var(--color-primary)] mt-2">Get In Touch</h2>
          <p className="text-[var(--color-muted)] mt-3">Reach out to us for your construction needs</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="reveal">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all" 
                  required
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all" 
                  required
                />
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all" 
                required
              />
              <select className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all">
                <option>Select Service</option>
                <option>General Contracting</option>
                <option>Residential Construction</option>
                <option>Commercial Building</option>
                <option>Renovation</option>
                <option>Other</option>
              </select>
              <textarea 
                rows={4} 
                placeholder="Message" 
                className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                required
              />
              <button 
                type="submit" 
                className="btn-primary w-full justify-center hover:-translate-y-1 transition-all duration-300 group"
              >
                Send Message 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
          <div className="space-y-4 reveal animation-delay-300">
            {contactItems.map((item) => (
              <div 
                key={item.title} 
                className="card p-6 hover-lift hover:border-[var(--color-accent)]/20 transition-all duration-300"
              >
                <h3 className="font-bold text-[var(--color-foreground)] flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-[var(--color-accent)]" />
                  {item.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm mt-1 whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}