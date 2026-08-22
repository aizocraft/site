"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

interface ContactItem {
  icon: React.ElementType;
  title: string;
  content: string;
}

const contactItems: ContactItem[] = [
  { icon: MapPin, title: "Location", content: "Nairobi, Kenya" },
  { icon: Phone, title: "Phone", content: "24/7: +2547 1778 0056" },
  { icon: Mail, title: "Email", content: "davidmunene134@gmail.com" },
];

// EmailJS Configuration
const EMAILJS_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_nenes_construction",
  templates: {
    admin: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN || "template_admin_notification",
    sender: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_SENDER || "template_sender_reply",
  },
};

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Extract form data
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const emailAddress = formData.get("emailAddress") as string;
    const service = formData.get("service") as string;
    const message = formData.get("message") as string;

    // Construct subject from service selection
    const subject = `New Inquiry: ${service}`;

    // Get current date
    const received_date = new Date().toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const year = new Date().getFullYear();

    try {
      // 1. Send Admin Notification
      const adminTemplateParams = {
        from_name: fullName,
        from_email: emailAddress,
        subject: subject,
        message: message,
        received_date: received_date,
        phone: phoneNumber,
        service: service,
        response_time: "24 hours",
      };

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.admin,
        adminTemplateParams
      );

      // 2. Send Auto-Reply to Sender
      const senderTemplateParams = {
        sender_name: fullName,
        subject: subject,
        message: message,
        response_time: "24 hours",
        reply_name: "David Munene",
        reply_email: "davidmunene134@gmail.com",
        phone_number: "+2547 1778 0056",
        website_url: "https://nenesconstruction.vercel.app",
        portfolio_url: "https://nenesconstruction.vercel.app/gallery",
        year: year.toString(),
      };

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.sender,
        senderTemplateParams
      );

      // Success
      setFormStatus({
        type: "success",
        message: "Thank you! We'll be in touch within 24 hours.",
      });
      form.reset();

    } catch (error) {
      console.error("Email sending failed:", error);
      setFormStatus({
        type: "error",
        message: "Something went wrong. Please try again or call us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding section-alt">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <span className="badge badge-primary">Contact</span>
          <h2 className="heading-lg text-[var(--color-primary)] mt-2">
            Get In Touch
          </h2>
          <p className="text-[var(--color-muted)] mt-3">
            Reach out to us for your construction needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="reveal">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                  required
                />
              </div>
              <input
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                required
              />
              <select
                name="service"
                className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                required
              >
                <option value="">Select Service</option>
                <option value="General Contracting">General Contracting</option>
                <option value="Residential Construction">
                  Residential Construction
                </option>
                <option value="Commercial Building">Commercial Building</option>
                <option value="Renovation">Renovation</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                name="message"
                rows={4}
                placeholder="Message"
                className="input-field focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                required
              />

              {/* Status Messages */}
              {formStatus.type === "success" && (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#14532d] p-4 rounded-lg text-sm">
                  ✅ {formStatus.message}
                </div>
              )}
              {formStatus.type === "error" && (
                <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] p-4 rounded-lg text-sm">
                  ❌ {formStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center hover:-translate-y-1 transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
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
                <p className="text-[var(--color-muted)] text-sm mt-1 whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}