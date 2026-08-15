'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Building2, HardHat, Users, Package2, ClipboardCheck,
  Wallet, Truck, ChevronLeft, Menu, Bell, Search, LogOut, Layers
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/construction', color: 'text-blue-500' },
  { name: 'Sites', icon: Building2, path: '/dashboard/construction/sites', color: 'text-emerald-500' },
  { name: 'Engineers', icon: HardHat, path: '/dashboard/construction/engineers', color: 'text-indigo-500' },
  { name: 'Workers', icon: Users, path: '/dashboard/construction/workers', color: 'text-orange-500' },
  { name: 'Materials', icon: Package2, path: '/dashboard/construction/materials', color: 'text-amber-500' },
  { name: 'Attendance', icon: ClipboardCheck, path: '/dashboard/construction/attendance', color: 'text-rose-500' },
  { name: 'Payments', icon: Wallet, path: '/dashboard/construction/payments', color: 'text-purple-500' },
  { name: 'Suppliers', icon: Truck, path: '/dashboard/construction/suppliers', color: 'text-cyan-500' },
  { name: 'Quotes & Invoices', icon: ClipboardCheck, path: '/dashboard/construction/quotes', color: 'text-fuchsia-500' },
  { name: 'Settings', icon: Wallet, path: '/dashboard/construction/settings', color: 'text-slate-500' },
];

export default function ConstructionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    setTimeout(() => router.push('/auth/login'), 1200);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-gray-950 flex">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 z-50 h-screen flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 flex flex-col
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <Link href="/dashboard/construction" className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">BuildCorp</p>
                <p className="text-[10px] text-gray-400 leading-tight">CONSTRUCT MGT</p>
              </div>
            )}
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileOpen(false)}
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/dashboard/construction' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={item.name}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? item.color : ''}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center mx-3 mb-3 p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* User + logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user?.role || 'user'}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-4 lg:px-6 gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search sites, workers, materials..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:block">KSh</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
