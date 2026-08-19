'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Navigation,
  User,
  MessageCircle,
  Clock,
} from 'lucide-react';
import { submitContact } from '@/lib/api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  general?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactClient() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('submitting');
    setErrors({});

    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setStatus('success');

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setStatus('idle');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setErrors({
        general:
          error.response?.data?.error || 'Failed to send message. Please try again.',
      });

      setTimeout(() => {
        setStatus('idle');
        setErrors({});
      }, 5000);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Minimal Hero */}
      <section className="relative pt-16 pb-8 md:pt-20 md:pb-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Get In{' '}
              <span className="text-cyan-600 dark:text-cyan-400">
                Touch
              </span>
            </h1>

          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 pb-16 md:py-8 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
            {/* LEFT COLUMN - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 order-2 lg:order-1"
            >
              <div className="space-y-4">
                {/* Location Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-5 md:p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Location
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Kianjokoma, Embu County, Kenya
                      </p>
                      <motion.a
                        href="https://www.google.com/maps/place/Kianjokoma/@-0.3991154,37.5028517,17z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium mt-2"
                        whileHover={{ x: 3 }}
                      >
                        <Navigation size={12} />
                        Get Directions
                      </motion.a>
                    </div>
                  </div>
                </div>

                {/* Contact Methods - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Phone Card */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center mb-3">
                      <Phone size={16} className="text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Call Us
                    </h3>
                    <div className="space-y-1.5">
                      <motion.a
                        href="tel:+254724927322"
                        className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        <Phone size={10} />
                        <span>+254 724 927 322</span>
                      </motion.a>
                      <motion.a
                        href="tel:+254784909466"
                        className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        <Phone size={10} />
                        <span>+254 784 909 466</span>
                      </motion.a>
                    </div>
                  </div>

                  {/* Email Card */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-lg bg-cyan-600 flex items-center justify-center mb-3">
                      <Mail size={16} className="text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Email
                    </h3>
                    <motion.a
                      href="mailto:pamenji2017@gmail.com"
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors break-all"
                      whileHover={{ x: 3 }}
                    >
                      pamenji2017@gmail.com
                    </motion.a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-2 pt-2">
                  {[
                    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-[#1877f2]' },
                    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-[#1da1f2]' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-[#0077b5]' },
                    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-[#e4405f]' },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-300 ${social.color} hover:text-white`}
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 order-1 lg:order-2"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-5 sm:p-6 md:p-8">
                <div className="mb-5">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Send a Message
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>

                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Message Sent!
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Thank you for reaching out. We'll respond shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white ${
                            errors.name
                              ? 'border-red-500 focus:ring-red-500'
                              : focusedField === 'name'
                              ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                              : 'border-gray-300 dark:border-gray-700'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white ${
                              errors.email
                                ? 'border-red-500 focus:ring-red-500'
                                : focusedField === 'email'
                                ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                                : 'border-gray-300 dark:border-gray-700'
                            }`}
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white ${
                              errors.phone
                                ? 'border-red-500 focus:ring-red-500'
                                : focusedField === 'phone'
                                ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                                : 'border-gray-300 dark:border-gray-700'
                            }`}
                            placeholder="+254 700 000 000"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject - Text Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          onFocus={() => setFocusedField('subject')}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white ${
                            errors.subject
                              ? 'border-red-500 focus:ring-red-500'
                              : focusedField === 'subject'
                              ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                              : 'border-gray-300 dark:border-gray-700'
                          }`}
                          placeholder="What is this regarding?"
                        />
                      </div>
                      {errors.subject && (
                        <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message <span className="text-red-500">*</span>
                        <span className="text-gray-400 text-xs ml-2">
                          ({formData.message.length}/5000)
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          handleChange('message', e.target.value.slice(0, 5000))
                        }
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full p-3 text-sm border rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white resize-none ${
                          errors.message
                            ? 'border-red-500 focus:ring-red-500'
                            : focusedField === 'message'
                            ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                        placeholder="Tell us about your project or inquiry..."
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* General Error */}
                    {errors.general && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                        <span className="text-sm text-red-600 dark:text-red-400">
                          {errors.general}
                        </span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={status === 'submitting'}
                      className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        status === 'submitting'
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md hover:shadow-lg'
                      }`}
                      whileHover={status !== 'submitting' ? { scale: 1.01 } : {}}
                      whileTap={status !== 'submitting' ? { scale: 0.98 } : {}}
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.24048583797176!2d37.50285170099523!3d-0.39911544439136193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1827ce5c5f85c05b%3A0xac4ecee3cea25eea!2sKianjokoma!5e1!3m2!1sen!2ske!4v1786993501591!5m2!1sen!2ske"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full"
              title="SunSea Electrical Location - Kianjokoma, Embu County, Kenya"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}