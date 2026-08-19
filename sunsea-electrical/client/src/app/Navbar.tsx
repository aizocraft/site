// src/app/Navbar.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  Home,
  Package,
  Phone,
  Wrench,
  Award,
  Briefcase,
  LogIn,
  Bell,
  CircleDot,
  Truck,
  PhoneCall
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/context/ThemeContext'
import Avatar from '@/components/Avatar'
import { useProfile } from '@/lib/profile'
import { useCompanySettings } from '@/lib/use-company-settings'
import { getLogoUrl } from '@/lib/company'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [avatarKey, setAvatarKey] = useState(Date.now())
  const [bannerVisible, setBannerVisible] = useState(true)
  
  const { totalItems, loading: cartLoading } = useCartStore()
  const { user, isLoggedIn, loading: authLoading, logout, isAdmin, isSales } = useAuth()
  const { profile } = useProfile()
  const { data: company } = useCompanySettings()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const profileMenuRef = useRef<HTMLDivElement>(null)
  const bannerTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const hasSalesAccess = isSales

  // Navigation Links - POS removed
  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Briefcase },
    { href: '/#services', label: 'Services', icon: Wrench },
  ]

  const rightNavLinks = [
    { href: '/products', label: 'Products', icon: Package },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/contact', label: 'Contact', icon: Phone },
  ]

  // Auto-hide banner after 8 seconds
  useEffect(() => {
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current)
    }
    bannerTimeoutRef.current = setTimeout(() => {
      setBannerVisible(false)
    }, 8000)
    return () => {
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (profile?.avatar) {
      setAvatarKey(Date.now())
    }
  }, [profile?.avatar])

  const handleLogout = useCallback(async () => {
    await logout()
    router.push('/auth/login')
    setIsMenuOpen(false)
    setShowProfileMenu(false)
  }, [logout, router])

  const closeAllDropdowns = useCallback(() => {
    setShowProfileMenu(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
    if (!isMenuOpen) {
      closeAllDropdowns()
    }
  }, [isMenuOpen, closeAllDropdowns])

  useEffect(() => {
    setIsMenuOpen(false)
    closeAllDropdowns()
  }, [pathname, closeAllDropdowns])

  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
        closeAllDropdowns()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [closeAllDropdowns])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-20">
        <div className="max-w-7xl mx-auto px-4 h-full" />
      </nav>
    )
  }

  const defaultLogoUrl = 'https://res.cloudinary.com/duxnsu61a/image/upload/v1786791785/logo_y5yjxh.png'
  const logoUrl = getLogoUrl(company) || defaultLogoUrl
  const companyName = company?.companyName || 'SunSea Electrical'

  return (
    <>
      {/* Premium Banner */}
      <div 
        className={`fixed top-0 left-0 right-0 z-[60] bg-[#0a0a1a] text-white transition-all duration-700 ease-in-out overflow-hidden ${
          bannerVisible ? 'max-h-12 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-6 text-[11px] sm:text-sm min-w-0">
            <a
              href="tel:+254784909466"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-white hover:text-[#4a9eff] transition-colors duration-200 shrink-0"
              aria-label="Call SunSea Electrical"
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4a9eff]" />
              <span className="font-medium">Call 0784 909 466</span>
            </a>
            <a
              href="https://wa.me/254784909466"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-white hover:text-[#25D366] transition-colors duration-200 shrink-0"
              aria-label="Chat on WhatsApp"
            >
              <Image
                src="/whatsapp-logo.png"
                alt=""
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              />
              <span className="font-medium">WhatsApp</span>
            </a>
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="w-px h-4 bg-white/20" />
              <Truck className="w-4 h-4 text-[#4a9eff] shrink-0" />
              <span className="truncate">Free shipping on orders over 150K</span>
            </div>
          </div>
          <button 
            onClick={() => setBannerVisible(false)}
            className="text-white/60 hover:text-white transition-colors duration-200 p-1 shrink-0"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <nav className={`fixed left-0 right-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg transition-all duration-300 ${
        bannerVisible ? 'top-12' : 'top-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56">
              <Link
                href="/"
                className="flex items-center transition-all duration-300 hover:opacity-90 active:scale-[0.97] group"
                aria-label="Home"
              >
                <div className="relative h-12 w-40 sm:h-14 sm:w-48 md:h-16 md:w-56 lg:h-20 lg:w-64">
                  <Image
                    src='https://res.cloudinary.com/duxnsu61a/image/upload/v1786791785/logo_y5yjxh.png'
                    alt={companyName}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-0.5 xl:gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 xl:px-4 py-2 text-sm xl:text-base font-medium transition-all duration-200 rounded-lg ${
                    pathname === href
                      ? 'text-[#0a0a1a] dark:text-white bg-black/5 dark:bg-white/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#0a0a1a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {label}
                  {pathname === href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#0a0a1a] dark:bg-white rounded-full" />
                  )}
                </Link>
              ))}

              {rightNavLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 xl:px-4 py-2 text-sm xl:text-base font-medium transition-all duration-200 rounded-lg ${
                    pathname === href
                      ? 'text-[#0a0a1a] dark:text-white bg-black/5 dark:bg-white/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#0a0a1a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {label}
                  {pathname === href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#0a0a1a] dark:bg-white rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#0a0a1a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                aria-label="Shopping cart"
              >
                {cartLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
                )}
                {totalItems > 0 && !cartLoading && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#0a0a1a] dark:bg-white dark:text-[#0a0a1a] rounded-full shadow-md">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#0a0a1a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
                ) : (
                  <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                )}
              </button>

              {/* Mobile Login */}
              {!authLoading && !isLoggedIn && (
                <Link
                  href="/auth/login"
                  className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#0a0a1a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                  aria-label="Sign In"
                >
                  <LogIn className="w-5 h-5" />
                </Link>
              )}

              {/* Auth Section */}
              {!authLoading && (
                <>
                  {isLoggedIn && user ? (
                    <div className="relative" ref={profileMenuRef}>
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg transition-all duration-200 ${
                          showProfileMenu 
                            ? 'bg-black/5 dark:bg-white/10' 
                            : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Avatar 
                          key={avatarKey}
                          size="sm"
                          userId={user?.id || user?._id}
                          className="ring-2 ring-white dark:ring-gray-800 shadow-sm transition-transform duration-200 hover:scale-105"
                        />
                        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user.name?.split(' ')[0]}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Profile Dropdown */}
                      {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="py-1.5">
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <User className="w-4 h-4 text-gray-400" />
                              My Profile
                            </Link>

                            {isAdmin && (
                              <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                onClick={() => setShowProfileMenu(false)}
                              >
                                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                                Admin Dashboard
                              </Link>
                            )}

                            {hasSalesAccess && (
                              <Link
                                href="/sales"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                onClick={() => setShowProfileMenu(false)}
                              >
                                <Award className="w-4 h-4 text-gray-400" />
                                Sales Dashboard
                              </Link>
                            )}

                            <Link
                              href="/orders"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <Package className="w-4 h-4 text-gray-400" />
                              My Orders
                            </Link>

                            <Link
                              href="/notifications"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <Bell className="w-4 h-4 text-gray-400" />
                              Notifications
                              <span className="ml-auto w-5 h-5 rounded-full bg-[#0a0a1a] dark:bg-white text-white dark:text-[#0a0a1a] text-[10px] font-bold flex items-center justify-center">
                                3
                              </span>
                            </Link>

                            <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="hidden lg:flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#0a0a1a] dark:bg-white dark:text-[#0a0a1a] rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                    >
                      Sign In
                      <LogIn className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </>
              )}

              {authLoading && (
                <div className="hidden lg:block w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-[#0a0a1a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-[calc(100vh-64px)] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-4 py-2 space-y-0.5">
              {[...navLinks, ...rightNavLinks].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    pathname === href
                      ? 'text-[#0a0a1a] dark:text-white bg-black/5 dark:bg-white/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#0a0a1a] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className={`transition-all duration-300 ${bannerVisible ? 'h-28' : 'h-20'}`} />
    </>
  )
}