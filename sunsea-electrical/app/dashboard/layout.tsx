"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileDown,
  BarChart3,
  Settings,
  ChevronLeft,
  Calendar,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, tab: null },
  { name: "Workers", href: "/dashboard?tab=workers", icon: Users, tab: "workers" },
  { name: "Materials", href: "/dashboard?tab=materials", icon: Package, tab: "materials" },
  { name: "Projects", href: "/dashboard?tab=projects", icon: Calendar, tab: "projects" },
  { name: "Downloads", href: "/dashboard?tab=downloads", icon: FileDown, tab: "downloads" },
  { name: "Reports", href: "/dashboard?tab=reports", icon: BarChart3, tab: "reports" },
  { name: "Settings", href: "/dashboard?tab=settings", icon: Settings, tab: "settings" },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-800 fixed h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#f9ad07] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <span className="text-[#00255e] font-bold text-sm">SE</span>
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 dark:text-white">SunSea</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            link.tab === null
              ? activeTab === null && pathname === "/dashboard"
              : activeTab === link.tab;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#f9ad07]/10 text-[#f9ad07] shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1f2e] hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <link.icon className={`w-4 h-4 ${isActive ? "text-[#f9ad07]" : ""}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1f2e] hover:text-gray-900 dark:hover:text-white transition-all duration-300"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1f2e] hover:text-gray-900 dark:hover:text-white transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Site
        </Link>
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0a0e1a]">
      {/* Sidebar */}
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            <div className="flex items-center gap-3 lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#f9ad07] flex items-center justify-center">
                  <span className="text-[#00255e] font-bold text-xs">SE</span>
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-white">Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Live Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1a1f2e] transition-colors duration-300">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                <div className="w-8 h-8 rounded-full bg-[#f9ad07]/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#f9ad07]" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}