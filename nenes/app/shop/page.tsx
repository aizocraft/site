"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Bell, CheckCircle, Truck, Shield, Clock, HardHat, Hammer, Paintbrush, PencilRuler, Building } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="section-padding section-alt min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="heading-lg text-[var(--color-primary)]">Nenes Construction Supplies</h1>
            <span className="badge badge-highlight text-sm">Coming Soon</span>
          </div>
          <p className="text-[var(--color-muted)] mt-2">
            Premium construction materials and equipment delivered to your site.
          </p>
        </div>

        {/* Hero Banner - solid green, no gradient */}
        <div className="relative rounded-3xl overflow-hidden bg-[var(--color-primary)] p-8 md:p-12 mb-12">
          <div className="relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Get notified when we launch</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Your One-Stop Construction Shop</h2>
            <p className="text-white/80 mt-2 max-w-lg mx-auto">
              From cement and steel to power tools and finishing materials — we&apos;re bringing quality
              construction supplies directly to your site.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] min-w-[250px]"
              />
              <button className="px-6 py-3 bg-[var(--color-highlight)] text-white rounded-xl font-medium hover:bg-[var(--color-highlight-hover)] transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Building,
              title: "Cement & Aggregates",
              desc: "Premium cement, sand, gravel, and stone",
              bg: "bg-[var(--color-highlight-soft)] text-[var(--color-highlight)]",
            },
            {
              icon: Hammer,
              title: "Steel & Reinforcement",
              desc: "Rebar, beams, columns, and mesh",
              bg: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
            },
            {
              icon: PencilRuler,
              title: "Tools & Equipment",
              desc: "Power tools, scaffolding, and machinery",
              bg: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
            },
            {
              icon: Paintbrush,
              title: "Finishing Materials",
              desc: "Tiles, paint, flooring, and fixtures",
              bg: "bg-[var(--color-primary-soft)] text-[var(--color-primary-light)]",
            },
          ].map((item) => (
            <div key={item.title} className="card p-6 text-center card-hover group">
              <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-[var(--color-foreground)]">{item.title}</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Shop With Us */}
        <div className="mb-12">
          <h2 className="heading-md text-[var(--color-primary)] text-center mb-8">Why Shop With Nenes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Quality Guaranteed", desc: "All materials sourced from trusted manufacturers" },
              { icon: Truck, title: "Nationwide Delivery", desc: "Site delivery with real-time tracking" },
              { icon: Clock, title: "Expert Support", desc: "Technical support available 7 days a week" },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center hover-lift">
                <div className="w-14 h-14 bg-[var(--color-primary-icon-bg)] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--color-foreground)]">{item.title}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Countdown */}
        <div className="card p-8 md:p-12 text-center border-2 border-[var(--color-highlight-soft)]">
          <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">Launching Soon</h3>
          <p className="text-[var(--color-muted)] mb-6">We&apos;re preparing something amazing for you</p>
          <div className="flex justify-center gap-4">
            {[
              { value: "14", label: "Days" },
              { value: "08", label: "Hours" },
              { value: "45", label: "Minutes" },
              { value: "30", label: "Seconds" },
            ].map((time) => (
              <div key={time.label} className="bg-[var(--color-section-alt)] rounded-xl p-4 min-w-[70px] border border-[var(--color-card-border)]">
                <span className="text-2xl font-bold text-[var(--color-primary)]">{time.value}</span>
                <p className="text-xs text-[var(--color-muted)]">{time.label}</p>
              </div>
            ))}
          </div>
          <button className="btn-primary mt-6">
            Get Early Access
          </button>
        </div>
      </div>
    </div>
  );
}
