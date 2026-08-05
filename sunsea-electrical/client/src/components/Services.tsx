// src/components/Services.tsx
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sun, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Shield, 
  Zap,
  Gauge,
  Building2,
  Camera,
  Wrench
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Service {
  id: number;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  longDescription: string;
  image: string;
  benefits: string[];
}

const services: Service[] = [
  {
    id: 1,
    Icon: Zap,
    title: "Industrial Power Systems",
    description: "MV/LV switchgear, distribution, motor control, and substation engineering delivering reliable industrial power.",
    longDescription: "Our industrial power systems service covers everything from MV/LV switchgear and distribution boards to motor control centers and complete substation engineering. We design, install, and maintain robust power infrastructure that keeps your operations running safely and efficiently, with full compliance to Kenyan and international standards.",
    features: [
      "MV/LV Switchgear & Distribution",
      "Motor Control Centers",
      "Substation Engineering",
      "Power Factor Correction",
      "Protection & Relay Systems",
      "24/7 Maintenance & Support"
    ],
    benefits: [
      "100% safety compliance",
      "15-year installation warranty",
      "Free annual maintenance",
      "Emergency response team"
    ],
    image: "/images/solar.jpg",
  },
  {
    id: 2,
    Icon: Sun,
    title: "Solar Energy Solutions",
    description: "Rooftop, ground-mount, and hybrid PV with battery storage and EPC delivery.",
    longDescription: "Transform your energy consumption with our bespoke solar solutions. We engineer, supply, and install high-efficiency photovoltaic systems—rooftop, ground-mount, and hybrid PV with battery storage and full EPC delivery—tailored to your specific energy needs. From residential to industrial applications, our solutions deliver reliable power, significant cost savings, and reduced carbon footprint with intelligent monitoring and optimal performance.",
    features: [
      "Rooftop, Ground-Mount & Hybrid PV",
      "Battery Storage Solutions",
      "Full EPC Delivery",
      "Smart Energy Monitoring System",
      "Professional Installation Team",
      "10-Year Comprehensive Warranty"
    ],
    benefits: [
      "40-60% energy cost reduction",
      "Grid independence option",
      "Remote monitoring included",
      "Government incentive eligible"
    ],
    image: "/images/solar.jpg",
  },
  {
    id: 3,
    Icon: Gauge,
    title: "Generator Systems",
    description: "Diesel, gas, and hybrid gensets with synchronisation and grid paralleling.",
    longDescription: "Our generator systems service delivers reliable backup and prime power through diesel, gas, and hybrid gensets. We design, supply, install, and commission complete generator systems with automatic synchronisation and grid paralleling for commercial, industrial, and residential applications—ensuring uninterrupted power whenever you need it.",
    features: [
      "Diesel, Gas & Hybrid Gensets",
      "Automatic Synchronisation",
      "Grid Paralleling",
      "Automatic Transfer Switches",
      "Sound-Attenuated Enclosures",
      "24/7 Maintenance & Support"
    ],
    benefits: [
      "Uninterrupted power supply",
      "Seamless load sharing",
      "Backup during outages",
      "Emergency response team"
    ],
    image: "/images/watertower.jpg",
  },
  {
    id: 4,
    Icon: Building2,
    title: "Smart Building Systems",
    description: "IoT-enabled lighting, security, and climate control systems for modern, efficient commercial buildings.",
    longDescription: "Our smart building systems service delivers intelligent, IoT-enabled solutions for lighting, security, and climate control. We design and integrate automated systems that reduce energy consumption, enhance occupant comfort, and provide centralized monitoring and control for modern commercial and residential buildings.",
    features: [
      "IoT-Enabled Lighting Control",
      "Integrated Security Systems",
      "Smart Climate Control",
      "Energy Monitoring & Analytics",
      "Centralized Building Management",
      "Comprehensive Maintenance Programs"
    ],
    benefits: [
      "30-50% energy reduction",
      "Remote building management",
      "Enhanced security & safety",
      "Free system assessment"
    ],
    image: "/images/watertower.jpg",
  },
  {
    id: 5,
    Icon: Camera,
    title: "CCTV & Networking",
    description: "Comprehensive security systems and structured cabling for enterprise networks.",
    longDescription: "Our CCTV & Networking service delivers comprehensive security systems and structured cabling for enterprise networks. We design and install high-definition CCTV surveillance, access control, and structured data cabling that keep your premises secure and your business connected—with reliable, future-ready network infrastructure.",
    features: [
      "HD CCTV Surveillance Systems",
      "Access Control Systems",
      "Structured Data Cabling",
      "Enterprise Network Installation",
      "Remote Monitoring Access",
      "24/7 Technical Support"
    ],
    benefits: [
      "Enhanced security & safety",
      "Remote monitoring access",
      "Reliable network infrastructure",
      "Free site assessment"
    ],
    image: "/images/solar.jpg",
  },
  {
    id: 6,
    Icon: Wrench,
    title: "Maintenance Contracts",
    description: "Regular maintenance and emergency repair services for all electrical systems.",
    longDescription: "Our maintenance contracts service provides regular preventive maintenance and emergency repair for all electrical systems. We keep your power infrastructure—panels, switchgear, generators, and solar systems—running at peak performance with scheduled inspections, testing, and rapid-response repairs, protecting your investment and reducing costly downtime.",
    features: [
      "Scheduled Preventive Maintenance",
      "Emergency Repair Services",
      "Panel & Switchgear Servicing",
      "Generator & Solar System Care",
      "Performance Testing & Reporting",
      "Priority Response Support"
    ],
    benefits: [
      "Reduced downtime",
      "Extended equipment lifespan",
      "Predictable maintenance costs",
      "Priority emergency response"
    ],
    image: "/images/watertower.jpg",
  },
];

// Custom 3D Tilt Card Component
const TiltCard3D = ({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 30, 
    transition: { 
      duration: 0.2,
      type: "tween"
    } 
  },
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const openModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <section id="services" className="relative py-20 sm:py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-gray-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="px-2 sm:px-4 lg:max-w-8xl lg:mx-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5">
            Our{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Services
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Electrical and energy solutions engineered for a sustainable future
          </p>
        </motion.div>

        {/* Desktop: 3D Tilt Cards - Larger cards with more padding */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          {services.map((service, index) => {
            const Icon = service.Icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              >
                <TiltCard3D>
                  <div 
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200 dark:border-gray-800"
                    onClick={() => openModal(service)}
                  >
                    {/* Image Section - Taller for better visibility */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gray-900/40" />
                    </div>
                    
                    {/* Content - Larger padding for bigger cards */}
                    <div className="p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            {service.title}
                          </h3>
                          <div className="w-16 h-0.5 bg-blue-500 rounded-full mt-2 transition-all duration-300 group-hover:w-24" />
                        </div>
                      </div>
                      
                      {/* Description - Larger text */}
                      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(service);
                        }}
                        className="w-full h-12 mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg"
                      >
                        <span>Explore Service</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </div>

        {/* Tablet Grid (md to lg) - Larger cards */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-5">
          {services.map((service, index) => {
            const Icon = service.Icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 bg-white dark:bg-gray-900 hover:scale-[1.02] cursor-pointer h-full"
                  onClick={() => openModal(service)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h3>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 mr-2 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(service);
                      }}
                      className="w-full h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Layout (below md) - Slightly larger cards */}
        <div className="grid md:hidden gap-5">
          {services.map((service, index) => {
            const Icon = service.Icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card
                  className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-500 bg-white dark:bg-gray-900 cursor-pointer"
                  onClick={() => openModal(service)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{service.title}</h3>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(service);
                      }}
                      className="w-full h-9 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                    >
                      Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

{/* Modal - Rendered via portal to body to avoid navbar overlap and any parent overflow/transform clipping */}
        {typeof window !== 'undefined' && createPortal(
          <AnimatePresence mode="wait">
            {isModalOpen && selectedService && (
              <motion.div
                key="modal-backdrop"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
                onClick={closeModal}
              >
                <motion.div
                  key="modal-content"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header - sticky to always stay visible */}
                  <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                          <selectedService.Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{selectedService.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Premium Service Provider</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={closeModal}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex-shrink-0 ml-2 shadow-sm"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Close"
                        type="button"
                      >
                        <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Scrollable Body */}
                  <div className="overflow-y-auto max-h-[calc(85vh-88px)] sm:max-h-[calc(85vh-100px)]">
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                      {/* Image */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                        <img
                          src={selectedService.image}
                          alt={selectedService.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                        {selectedService.longDescription}
                      </p>

                      {/* Features */}
                      <div>
                        <h4 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          Key Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {selectedService.features.map((feature, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start group/feature"
                            >
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 transition-transform group-hover/feature:scale-110" />
                              <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      {selectedService.benefits && selectedService.benefits.length > 0 && (
                        <div>
                          <h4 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            Why Choose Us
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedService.benefits.map((benefit, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"
                              >
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{benefit}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <Button
                        size="lg"
                        className="w-full h-11 sm:h-14 text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group"
                        onClick={() => {
                          closeModal();
                          setTimeout(() => {
                            window.location.href = "/contact";
                          }, 200);
                        }}
                      >
                        <span>Request a Quote</span>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
};

export default Services;
