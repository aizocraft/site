'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const isCallbackPage = pathname === '/auth/callback'
  const isForgotPasswordPage = pathname === '/auth/forgot-password'
  const isResetPasswordPage = pathname === '/auth/reset-password'
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    pathname === '/auth/register' ? 'register' : 'login'
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isCallbackPage && !isForgotPasswordPage && !isResetPasswordPage) {
      setActiveTab(pathname === '/auth/register' ? 'register' : 'login')
    }
  }, [pathname, isCallbackPage, isForgotPasswordPage, isResetPasswordPage])

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    router.push(`/auth/${tab === 'login' ? 'login' : 'register'}`)
  }

  const showTabs = !isCallbackPage && !isForgotPasswordPage && !isResetPasswordPage

  if (!mounted) return null

  // Dynamic content based on page
  const getPageTitle = () => {
    if (isForgotPasswordPage) return 'Reset Password'
    if (isResetPasswordPage) return 'Create New Password'
    return activeTab === 'login' ? 'Welcome Back' : 'Create Account'
  }

  const getPageSubtitle = () => {
    if (isForgotPasswordPage) return 'Enter your email to receive a reset link'
    if (isResetPasswordPage) return 'Choose a strong password for your account'
    return activeTab === 'login'
      ? 'Sign in to continue to your account'
      : 'Join us today and get started'
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 pt-24 sm:pt-28 lg:pt-32 pb-10 relative overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Subtle background accent - solid, no gradient */}
      <div className="absolute inset-0 bg-[#0089d1]/5 dark:bg-[#0089d1]/10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md lg:max-w-lg transform transition-all duration-500 animate-fadeInUp">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 lg:mb-8"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
          >
            {getPageTitle()}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 mt-2 text-sm lg:text-base"
          >
            {getPageSubtitle()}
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <AnimatePresence>
          {showTabs && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative bg-white dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl p-1 mb-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="relative flex gap-1">
                <button
                  onClick={() => handleTabChange('login')}
                  className={`relative flex-1 py-3 px-4 lg:py-3.5 lg:px-6 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 z-10 ${
                    activeTab === 'login'
                      ? 'bg-[#0043b3] text-white shadow-md shadow-blue-500/25'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleTabChange('register')}
                  className={`relative flex-1 py-3 px-4 lg:py-3.5 lg:px-6 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 z-10 ${
                    activeTab === 'register'
                      ? 'bg-[#0043b3] text-white shadow-md shadow-blue-500/25'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  Sign Up
                </button>
                <motion.div
                  layout
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#0043b3] rounded-xl shadow-lg ${
                    activeTab === 'login' ? 'left-1' : 'left-[calc(50%-2px)]'
                  }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white dark:bg-gray-900 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-200/20 dark:shadow-black/20"
        >
          {children}
        </motion.div>

        {/* Footer */}
        <AnimatePresence>
          {showTabs && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-6 lg:mt-8 text-xs lg:text-sm text-gray-500 dark:text-gray-400"
            >
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                Privacy Policy
              </Link>.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-fadeInUp {
            animation: fadeInUp 0.4s ease-out;
          }
        }
      `}</style>
    </div>
  )
}
