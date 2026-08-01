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
} from "lucide-react";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, tab: null },
  { name: "Workers", href: "/dashboard?tab=workers", icon: Users, tab: "workers" },
  { name: "Materials", href: "/dashboard?tab=materials", icon: Package, tab: "materials" },
  { name: "Downloads", href: "/dashboard?tab=downloads", icon: FileDown, tab: "downloads" },
  { name: "Reports", href: "/dashboard?tab=reports", icon: BarChart3, tab: "reports" },
  { name: "Settings", href: "/dashboard?tab=settings", icon: Settings, tab: "settings" },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[var(--color-card-bg)] border-r border-[var(--color-card-border)]">
<div className="p-5 border-b border-[var(--color-card-border)]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">NC</span>
          </div>
          <div>
            <p className="font-bold text-sm text-[var(--color-foreground)]">Nenes</p>
            <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Dashboard</p>
          </div>
        </Link>
      </div>

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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] dark:text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-section-alt)] hover:text-[var(--color-foreground)]"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--color-card-border)]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-section-alt)] hover:text-[var(--color-foreground)] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[var(--color-card-bg)]/80 backdrop-blur-xl border-b border-[var(--color-card-border)]">
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            <div className="flex items-center gap-3 lg:hidden">
<Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">NC</span>
                </div>
                <span className="font-bold text-sm text-[var(--color-foreground)]">Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-highlight-soft)] rounded-lg">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-[var(--color-highlight)]">Live</span>
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
