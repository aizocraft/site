import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] dark:bg-[#050a15] text-white border-t border-gray-800/50">
      <div className="container-custom pt-12 md:pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info - Full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                <Image
                  src="/favicon.png"
                  alt="Nenes Construction"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Nenes
                </span>
                <span className="text-[10px] md:text-xs font-medium text-gray-400 tracking-widest uppercase">
                  Construction
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mt-2">
              Building Kenya&apos;s future with reliable construction solutions since 2010.
              Excellence in every structure.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Instagram, href: "#", label: "Instagram" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-[#16a34a] dark:hover:bg-[#22c55e] transition-all duration-300 flex items-center justify-center text-gray-400 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:block lg:block">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "About Us", href: "/#about" },
                { name: "Services", href: "/#services" },
                { name: "Portfolio", href: "/portfolio" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#16a34a] dark:hover:text-[#22c55e] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - Hidden on mobile, hidden on tablet, visible on desktop */}
          <div className="hidden lg:block">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "General Contracting",
                "Residential Construction",
                "Commercial Buildings",
                "Renovation & Remodeling",
                "Project Management",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/#services"
                    className="text-gray-400 hover:text-[#16a34a] dark:hover:text-[#22c55e] transition-colors duration-300"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Side by side with Quick Links on mobile */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0" />
                <span className="text-gray-400">+254 717 780 056</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0" />
                <span className="text-gray-400">nenesconstruction@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Mon-Sat: 8AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 md:mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nenes Construction. All rights reserved.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}