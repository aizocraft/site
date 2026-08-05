// src/components/WhatsAppButton.tsx
'use client';

import React, { useEffect, useState } from "react";
import { X, Send, Minimize2, MessageCircle, Zap, Sun, Wrench, Shield, Headphones, CheckCircle2 } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  accountName?: string;
  welcomeMessage?: string;
  avatar?: string;
}
const whatsappAvatar = "/whatsapp-logo.png";

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "254784909466",
  accountName = "Sun Sea Electrical",
  welcomeMessage = "Hi there! 👋 Welcome to Sun Sea Electrical. How can we assist you today?",
  avatar = "/logo.png",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Quick replies tailored for an electrical & energy company
  const quickReplies = [
    { icon: Zap, label: "Solar Solutions", color: "green", text: "I'm interested in Solar Energy solutions. Can you share options and pricing?" },
    { icon: Wrench, label: "Electrical Installations", color: "green", text: "I need Electrical Installation services. Can you help and share a quote?" },
    { icon: Sun, label: "Generator Systems", color: "green", text: "I need a Generator. What sizes and prices do you offer?" },
    { icon: Shield, label: "Smart Building", color: "green", text: "I'm interested in Smart Building & automation systems. Tell me more." },
    { icon: MessageCircle, label: "CCTV & Networking", color: "green", text: "I need CCTV & Networking services for my premises. Can you help?" },
    { icon: CheckCircle2, label: "Maintenance Contracts", color: "green", text: "I'm interested in a Maintenance Contract for my electrical systems." },
    { icon: Headphones, label: "Request Quotation", color: "green", text: "I need a quotation for electrical products and services. Can you help?" },
    { icon: MessageCircle, label: "Talk to an Engineer", color: "green", text: "I'd like to speak with an engineer about my project. When are you available?" },
  ];

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Check scroll position to hide on certain conditions
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down fast, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = () => {
    const text = message || welcomeMessage;
    const encodedMessage = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
    setMessage("");
  };

  const handleQuickReply = (replyText: string) => {
    const fullMessage = `${replyText}`;
    const encodedMessage = encodeURIComponent(fullMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button - solid green, no gradient */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        } ${isVisible ? 'translate-y-0' : 'translate-y-24'}`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-green-600 text-white rounded-full p-3 shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-pulse-slow"
        >
          {/* Ripple Effect */}
          <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ripple"></span>
          <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ripple-delay"></span>

          {/* Real WhatsApp Icon from local file */}
          <img
            src={whatsappAvatar}
            alt="WhatsApp"
            className="w-8 h-8 relative z-10 object-contain"
          />

          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* WhatsApp Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-500 transform ${
            isMinimized ? 'h-14' : 'h-[560px]'
          } ${isVisible ? 'translate-y-0' : 'translate-y-24'} animate-slideUp`}
        >
          {/* Header - solid green, no gradient */}
          <div className={`bg-green-600 rounded-t-2xl p-4 text-white ${isDarkMode ? 'bg-green-700' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={whatsappAvatar}
                    alt={accountName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-300 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-base">{accountName}</h3>
                  <p className="text-xs text-green-50">Online • Usually replies in minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Body - solid background, no gradient */}
              <div className="flex-1 p-4 overflow-y-auto h-[420px] bg-gray-50 dark:bg-gray-800">
                {/* Welcome Message */}
                <div className="flex items-start gap-2 mb-4 animate-fadeIn">
                  <img
                    src={avatar}
                    alt={accountName}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                    }}
                  />
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl rounded-tl-none p-3 shadow-md">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {welcomeMessage}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Quick Reply Buttons - updated for electrical services */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Quick replies:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickReplies.map((reply, idx) => {
                      const Icon = reply.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply.text)}
                          className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-2 rounded-xl transition-all duration-200 text-left border border-green-200 dark:border-green-800"
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{reply.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Headphones className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-[10px] text-gray-600 dark:text-gray-400">24/7 Support</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-[10px] text-gray-600 dark:text-gray-400">Free Consultation</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-[10px] text-gray-600 dark:text-gray-400">Quality Guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
                <div className="flex items-center gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white transition-all"
                    rows={1}
                    style={{ maxHeight: '80px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() && !welcomeMessage}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-2.5 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes rippleDelay {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-ripple {
          animation: ripple 1.5s ease-out infinite;
        }

        .animate-ripple-delay {
          animation: rippleDelay 1.5s ease-out infinite 0.75s;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
