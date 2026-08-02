import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] dark:bg-[#050a15] text-white border-t border-gray-800/50">
      <div className="container-custom pt-12 md:pt-16 lg:pt-20 pb-6 md:pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Company Info - Takes full width on mobile, 1 column on tablet */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/favicon.png"
                  alt="SunSea Electrical"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base md:text-lg font-bold tracking-tight text-white">
                  SunSea
                </span>
                <span className="text-[8px] md:text-[10px] font-medium text-gray-400 tracking-widest uppercase">
                  Electrical
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mt-2">
              Powering Kenya with reliable electrical solutions since 2010.
              Excellence in every connection.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Instagram, href: "#", label: "Instagram" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-800 hover:bg-[#008ad2] dark:hover:bg-[#33a8e8] transition-all duration-300 flex items-center justify-center text-gray-400 hover:text-white hover:scale-110 active:scale-95"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:block">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "About Us", href: "/#about" },
                { name: "Services", href: "/#services" },
                { name: "Portfolio", href: "/gallery" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#008ad2] dark:hover:text-[#33a8e8] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - 2 columns on mobile */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#008ad2] dark:text-[#33a8e8] flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-400 text-xs md:text-sm">Nairobi, Kenya<br />Mombasa Road</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#008ad2] dark:text-[#33a8e8] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-400 text-xs md:text-sm">+254 700 123 456</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#008ad2] dark:text-[#33a8e8] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-400 text-xs md:text-sm">info@sunsea.co.ke</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#008ad2] dark:text-[#33a8e8] flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-400 text-xs md:text-sm">Mon-Fri: 8AM - 6PM<br />Sat: 9AM - 2PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Quick Links - 2 column grid on mobile only */}
        <div className="md:hidden mt-8 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { name: "About", href: "/#about" },
                  { name: "Services", href: "/#services" },
                  { name: "Portfolio", href: "/gallery" },
                  { name: "Blog", href: "/blog" },
                  { name: "Contact", href: "/#contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#008ad2] dark:hover:text-[#33a8e8] transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Services
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  "Industrial Power",
                  "Solar Energy",
                  "Generator Systems",
                  "Smart Buildings",
                  "CCTV & Networking",
                  "Maintenance",
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="/#services"
                      className="text-gray-400 hover:text-[#008ad2] dark:hover:text-[#33a8e8] transition-colors duration-300"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Services - Hidden on mobile */}
        <div className="hidden md:block md:col-span-2 lg:col-span-1">
          <div className="mt-8 md:mt-0">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              {[
                "Industrial Power Systems",
                "Solar Energy Solutions",
                "Generator Systems",
                "Smart Building Systems",
                "CCTV & Networking",
                "Maintenance Contracts",
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/#services"
                    className="text-gray-400 hover:text-[#008ad2] dark:hover:text-[#33a8e8] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-500 gap-2">
          <p>&copy; {new Date().getFullYear()} SunSea Electrical. All rights reserved.</p>
          <div className="flex gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors duration-300 hover:scale-105">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors duration-300 hover:scale-105">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}