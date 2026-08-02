"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const contactItems = [
  { icon: MapPin, title: "Embu, Kenya", content: "Kianjokoma Town" },
  { icon: Phone, title: "Phone", content: "+2547 8490 9466" },
  { icon: Mail, title: "Email", content: "sunseaelectrical@gmail.com" },
];

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-page-alt">
      <div className="container-custom">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge badge-primary">Contact</span>
          <h2 className="heading-lg text-[#00255e] dark:text-white mt-2">Get In Touch</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3">Reach out to us for your electrical engineering needs</p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Reveal direction="right">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="input-field transition-all duration-300 hover:border-[#f9ad07]/50" />
                <input type="tel" placeholder="Phone Number" className="input-field transition-all duration-300 hover:border-[#f9ad07]/50" />
              </div>
              <input type="email" placeholder="Email Address" className="input-field transition-all duration-300 hover:border-[#f9ad07]/50" />
              <select className="input-field transition-all duration-300 hover:border-[#f9ad07]/50">
                <option>Select Service</option>
                <option>Industrial Power Systems</option>
                <option>Solar Energy Solutions</option>
                <option>Generator Systems</option>
                <option>Smart Building Systems</option>
                <option>Energy Audits</option>
                <option>Maintenance Contracts</option>
                <option>Other</option>
              </select>
              <textarea rows={4} placeholder="Message" className="input-field transition-all duration-300 hover:border-[#f9ad07]/50" />
              <button type="submit" className="btn-primary w-full justify-center group transition-all duration-300 hover:scale-[1.02] active:scale-95">
                Send Message <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.title} className="card p-6 hover-lift border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:border-[#f9ad07]">
                  <h3 className="font-bold text-[#f9ad07] dark:text-[#f9ad07]  flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-[#f9ad07] transition-transform duration-300 group-hover:scale-110" />
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 whitespace-pre-line">{item.content}</p>
                </div>
              ))}
              <div className="card overflow-hidden p-0 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:border-[#f9ad07]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853743783!2d36.68219671406249!3d-1.3028611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2s!4v1620000000000"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="SunSea Electrical Location"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}