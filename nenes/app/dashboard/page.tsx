"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  FileDown,
  Download,
  FileSpreadsheet,
  DollarSign,
  HardHat,
  TrendingUp,
  AlertTriangle,
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  LayoutDashboard,
  Settings,
  PiggyBank,
  Gauge,
  Activity,
  BatteryCharging,
  Save,
  RefreshCcw,
  Bell,
  ShieldCheck,
  UserPlus,
  BrickWall,
  Truck,
  Fuel,
  Wrench,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const workers = [
  { id: 1, name: "John Kariuki", role: "Site Foreman", phone: "+254 712 345 678", email: "john.k@nenes.co.ke", status: "Active", projects: 12, rate: 2500 },
  { id: 2, name: "Grace Wanjiku", role: "Structural Engineer", phone: "+254 723 456 789", email: "grace.w@nenes.co.ke", status: "Active", projects: 8, rate: 3500 },
  { id: 3, name: "Peter Omondi", role: "Mason", phone: "+254 734 567 890", email: "peter.o@nenes.co.ke", status: "Active", projects: 15, rate: 1200 },
  { id: 4, name: "Sarah Nyambura", role: "Project Manager", phone: "+254 745 678 901", email: "sarah.n@nenes.co.ke", status: "Active", projects: 20, rate: 4500 },
  { id: 5, name: "David Mwangi", role: "Carpenter", phone: "+254 756 789 012", email: "david.m@nenes.co.ke", status: "On Leave", projects: 3, rate: 1200 },
  { id: 6, name: "Mary Akinyi", role: "Safety Officer", phone: "+254 767 890 123", email: "mary.a@nenes.co.ke", status: "Active", projects: 18, rate: 3000 },
];

const materials = [
  { id: 1, name: "Cement (50kg bag)", qty: 450, unit: "Bags", minStock: 200, price: 700, supplier: "Bamburi Cement Ltd" },
  { id: 2, name: "Steel Rebar 12mm", qty: 120, unit: "Pcs", minStock: 50, price: 850, supplier: "Devki Steel Mills" },
  { id: 3, name: "River Sand (ton)", qty: 80, unit: "Tons", minStock: 30, price: 3500, supplier: "Machakos Quarries" },
  { id: 4, name: "Ballast (ton)", qty: 60, unit: "Tons", minStock: 25, price: 4500, supplier: "Kisumu Aggregates" },
  { id: 5, name: "Concrete Blocks 6-inch", qty: 2000, unit: "Pcs", minStock: 500, price: 45, supplier: "Nairobi Block Makers" },
  { id: 6, name: "Timber 2x4 (3m)", qty: 300, unit: "Pcs", minStock: 100, price: 350, supplier: "Timberland Ltd" },
  { id: 7, name: "Roofing Sheets (Gauge 30)", qty: 150, unit: "Pcs", minStock: 60, price: 850, supplier: "Mabati Rolling Mills" },
  { id: 8, name: "PVC Pipes 110mm", qty: 220, unit: "Pcs", minStock: 80, price: 650, supplier: "Plastco Kenya" },
];

const recentProjects = [
  { name: "Greenpark Estate", status: "In Progress", progress: 75, workers: 15, deadline: "2025-06-15" },
  { name: "Westside Tower", status: "Completed", progress: 100, workers: 20, deadline: "2025-03-01" },
  { name: "Eldoret Warehouse", status: "In Progress", progress: 45, workers: 12, deadline: "2025-07-20" },
  { name: "Nakuru Housing", status: "Completed", progress: 100, workers: 18, deadline: "2025-02-28" },
];

// ─── Tab Components ──────────────────────────────────────────────────────────

function OverviewTab() {
  const stats = [
    { icon: Users, label: "Total Workers", value: "36", change: "+4 this month", color: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent-soft)]" },
    { icon: Package, label: "Material Items", value: "210", change: "3 low stock", color: "text-[var(--color-highlight)]", bg: "bg-[var(--color-highlight-soft)]" },
    { icon: TrendingUp, label: "Active Projects", value: "6", change: "2 completing soon", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: DollarSign, label: "Monthly Payroll", value: "KES 1.8M", change: "36 workers paid", color: "text-[var(--color-primary-light)]", bg: "bg-[var(--color-primary-soft)]" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5 hover-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
                <p className="text-2xl font-bold text-[var(--color-foreground)] mt-1">{stat.value}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">{stat.change}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="card p-5">
        <h3 className="font-bold text-[var(--color-foreground)] mb-4">Recent Projects</h3>
        <div className="space-y-4">
          {recentProjects.map((p) => (
            <div key={p.name} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-section-alt)]">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[var(--color-foreground)] truncate">{p.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.status === "Completed" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  }`}>{p.status}</span>
                  <span className="text-xs text-[var(--color-muted)]">{p.workers} workers</span>
                  <span className="text-xs text-[var(--color-muted)]">Due: {p.deadline}</span>
                </div>
              </div>
              <div className="w-24">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[var(--color-card-border)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      p.progress === 100 ? "bg-green-500" : "bg-[var(--color-accent)]"
                    }`} style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-medium text-[var(--color-muted)]">{p.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-highlight-soft)] flex items-center justify-center">
              <FileDown className="w-6 h-6 text-[var(--color-highlight)]" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Download Attendance</p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">Worker attendance records for March 2025</p>
            </div>
          </div>
          <Link href="/attendance.xlsx" download className="btn-primary mt-4 w-full justify-center text-sm">
            <Download className="w-4 h-4" /> Download .xlsx
          </Link>
        </div>
        <div className="card p-5 hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-foreground)]">Download Payment Record</p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">March 2025 worker payment summary</p>
            </div>
          </div>
          <Link href="/payment.xlsx" download className="btn-primary mt-4 w-full justify-center text-sm bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4" /> Download .xlsx
          </Link>
        </div>
      </div>
    </div>
  );
}

function WorkersTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-[var(--color-foreground)]">Workers</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input type="text" placeholder="Search workers..." className="input-field pl-9 py-2 text-sm w-48" />
          </div>
          <button className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" /> Add Worker
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-card-border)] bg-[var(--color-section-alt)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-muted)]">Worker</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-muted)]">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-muted)]">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-muted)]">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-muted)]">Daily Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-muted)]">Projects</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} className="border-b border-[var(--color-card-border)] hover:bg-[var(--color-section-alt)] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                        {w.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-[var(--color-foreground)]">{w.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--color-muted)]">{w.role}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col text-xs text-[var(--color-muted)]">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</span>
                      <span className="flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" />{w.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      w.status === "Active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-[var(--color-highlight-soft)] text-[var(--color-highlight)]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${w.status === "Active" ? "bg-green-500" : "bg-[var(--color-highlight)]"}`} />
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[var(--color-foreground)]">KES {w.rate.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[var(--color-muted)]">{w.projects}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--color-section-alt)] text-[var(--color-muted)]">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MaterialsTab() {
  const lowStock = materials.filter((m) => m.qty <= m.minStock);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-[var(--color-foreground)]">Materials Inventory</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input type="text" placeholder="Search materials..." className="input-field pl-9 py-2 text-sm w-48" />
          </div>
          <button className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" /> Add Material
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{lowStock.length} materials are low on stock</p>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">Consider reordering soon to avoid project delays.</p>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-card-border)] bg-[var(--color-section-alt)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-muted)]">Material</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-muted)]">Supplier</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-muted)]">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-muted)]">Unit Price</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-muted)]">Total Value</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-muted)]">Min Stock</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => {
                const isLow = m.qty <= m.minStock;
                return (
                  <tr key={m.id} className="border-b border-[var(--color-card-border)] hover:bg-[var(--color-section-alt)] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${isLow ? "bg-red-500/10" : "bg-[var(--color-primary-soft)]"} flex items-center justify-center`}>
                          <Package className={`w-4 h-4 ${isLow ? "text-red-500" : "text-[var(--color-primary)]"}`} />
                        </div>
                        <span className="font-medium text-[var(--color-foreground)]">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--color-muted)]">{m.supplier}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${isLow ? "text-red-500" : "text-[var(--color-foreground)]"}`}>
                        {m.qty} {m.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--color-muted)]">KES {m.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium text-[var(--color-foreground)]">KES {(m.qty * m.price).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-[var(--color-muted)]">{m.minStock}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-[var(--color-section-alt)] text-[var(--color-muted)]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DownloadsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[var(--color-foreground)]">Document Downloads</h2>
      <p className="text-sm text-[var(--color-muted)]">Download attendance records, payment summaries, and reports.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 hover-lift">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-soft)] flex items-center justify-center">
              <FileSpreadsheet className="w-7 h-7 text-[var(--color-accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-foreground)]">Attendance Record</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">Worker daily attendance for March 2025. Includes check-in/out times, overtime, and leave records.</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--color-muted)]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 2025</span>
                <span className="flex items-center gap-1"><HardHat className="w-3 h-3" /> 36 workers</span>
              </div>
              <Link href="/attendance.xlsx" download className="btn-primary mt-4 w-full justify-center text-sm">
                <Download className="w-4 h-4" /> Download attendance.xlsx
              </Link>
            </div>
          </div>
        </div>

        <div className="card p-6 hover-lift">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-foreground)]">Payment Summary</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">March 2025 worker payments. Includes daily rates, hours worked, deductions, and net pay.</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--color-muted)]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 2025</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> KES 1,845,000</span>
              </div>
              <Link href="/payment.xlsx" download className="btn-primary mt-4 w-full justify-center text-sm bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4" /> Download payment.xlsx
              </Link>
            </div>
          </div>
        </div>

        <div className="card p-6 hover-lift">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-highlight-soft)] flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-[var(--color-highlight)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-foreground)]">Monthly Project Report</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">Project progress, material usage, labor hours, and budget tracking for March 2025.</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--color-muted)]">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Mar 2025</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 6 projects</span>
              </div>
              <button className="btn-primary mt-4 w-full justify-center text-sm opacity-60 cursor-not-allowed" disabled>
                <Download className="w-4 h-4" /> Coming Soon
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6 hover-lift">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-soft)] flex items-center justify-center">
              <Package className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-foreground)]">Inventory Report</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">Current stock levels, low-stock alerts, and material usage across all active projects.</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--color-muted)]">
                <span className="flex items-center gap-1"><Package className="w-3 h-3" /> 210 items</span>
                <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> 3 low stock</span>
              </div>
              <button className="btn-primary mt-4 w-full justify-center text-sm opacity-60 cursor-not-allowed" disabled>
                <Download className="w-4 h-4" /> Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[var(--color-foreground)]">Reports & Analytics</h2>
      <p className="text-sm text-[var(--color-muted)]">Financial, project, and operational performance reports.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Revenue", value: "KES 7.2M", change: "+15% vs last month", color: "text-green-500", bg: "bg-green-500/10" },
          { icon: PiggyBank, label: "Project Budget", value: "KES 9.5M", change: "76% utilized", color: "text-[var(--color-accent)]", bg: "bg-[var(--color-accent-soft)]" },
          { icon: Gauge, label: "Avg. Project Time", value: "52 days", change: "3 days ahead", color: "text-[var(--color-highlight)]", bg: "bg-[var(--color-highlight-soft)]" },
          { icon: Activity, label: "Efficiency Rate", value: "92%", change: "+4% improvement", color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 hover-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
                <p className="text-2xl font-bold text-[var(--color-foreground)] mt-1">{stat.value}</p>
                <p className="text-xs text-[var(--color-muted)] mt-1">{stat.change}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-[var(--color-foreground)] mb-4">Project Budget Overview</h3>
          <div className="space-y-4">
            {[
              { name: "Greenpark Estate", budget: 45000000, spent: 34000000 },
              { name: "Westside Tower", budget: 120000000, spent: 120000000 },
              { name: "Eldoret Warehouse", budget: 35000000, spent: 15000000 },
              { name: "Nakuru Housing", budget: 60000000, spent: 60000000 },
            ].map((p) => {
              const pct = Math.round((p.spent / p.budget) * 100);
              const isOver = p.spent >= p.budget;
              return (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[var(--color-foreground)]">{p.name}</span>
                    <span className="text-[var(--color-muted)]">KES {(p.spent / 1000000).toFixed(1)}M / KES {(p.budget / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="h-2 bg-[var(--color-card-border)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isOver ? "bg-green-500" : "bg-[var(--color-accent)]"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-[var(--color-foreground)] mb-4">Worker Productivity</h3>
          <div className="space-y-4">
            {[
              { name: "John Kariuki", tasks: 24, hours: 160, efficiency: 92 },
              { name: "Grace Wanjiku", tasks: 18, hours: 148, efficiency: 88 },
              { name: "Peter Omondi", tasks: 30, hours: 172, efficiency: 95 },
              { name: "Sarah Nyambura", tasks: 15, hours: 140, efficiency: 90 },
              { name: "Mary Akinyi", tasks: 20, hours: 155, efficiency: 91 },
            ].map((w) => (
              <div key={w.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                  {w.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{w.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{w.tasks} tasks · {w.hours}h</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[var(--color-accent)]">{w.efficiency}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Cost per Project", value: "KES 2.1M", color: "text-[var(--color-accent)]" },
          { icon: BatteryCharging, label: "Material Usage", value: "85%", color: "text-green-500" },
          { icon: TrendingUp, label: "Growth Rate", value: "+28% YoY", color: "text-[var(--color-highlight)]" },
          { icon: TrendingUp, label: "Profit Margin", value: "34%", color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center hover-lift">
            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-lg font-bold text-[var(--color-foreground)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[var(--color-foreground)]">Settings</h2>
      <p className="text-sm text-[var(--color-muted)]">Manage dashboard preferences, notifications, and account settings.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card p-6">
          <h3 className="font-bold text-[var(--color-foreground)] flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4" /> General
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Company Name</p>
                <p className="text-xs text-[var(--color-muted)]">Nenes Construction Ltd</p>
              </div>
              <button className="text-xs text-[var(--color-accent)] hover:underline">Edit</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Currency</p>
                <p className="text-xs text-[var(--color-muted)]">KES (Kenyan Shilling)</p>
              </div>
              <button className="text-xs text-[var(--color-accent)] hover:underline">Change</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Time Zone</p>
                <p className="text-xs text-[var(--color-muted)]">EAT (UTC+3)</p>
              </div>
              <button className="text-xs text-[var(--color-accent)] hover:underline">Change</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Date Format</p>
                <p className="text-xs text-[var(--color-muted)]">DD/MM/YYYY</p>
              </div>
              <button className="text-xs text-[var(--color-accent)] hover:underline">Change</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <h3 className="font-bold text-[var(--color-foreground)] flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4" /> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { label: "Low stock alerts", desc: "When materials fall below minimum stock" },
              { label: "Project milestone updates", desc: "When a project reaches 50%, 75%, 100%" },
              { label: "Worker attendance anomalies", desc: "Missed check-ins or unusual patterns" },
              { label: "Payment reminders", desc: "Weekly payroll due reminders" },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{n.label}</p>
                  <p className="text-xs text-[var(--color-muted)]">{n.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-[var(--color-card-border)] rounded-full peer peer-checked:bg-[var(--color-accent)] transition-all" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-all" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="card p-6">
          <h3 className="font-bold text-[var(--color-foreground)] flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4" /> Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Two-Factor Auth</p>
                <p className="text-xs text-[var(--color-muted)]">Extra layer of security for your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-[var(--color-card-border)] rounded-full peer peer-checked:bg-[var(--color-accent)] transition-all" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Password</p>
                <p className="text-xs text-[var(--color-muted)]">Last changed 30 days ago</p>
              </div>
              <button className="text-xs text-[var(--color-accent)] hover:underline">Change</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-foreground)]">Session Timeout</p>
                <p className="text-xs text-[var(--color-muted)]">30 minutes of inactivity</p>
              </div>
              <button className="text-xs text-[var(--color-accent)] hover:underline">Edit</button>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="card p-6">
          <h3 className="font-bold text-[var(--color-foreground)] flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4" /> Team Access
          </h3>
          <div className="space-y-4">
            {[
              { name: "John Kariuki", role: "Admin", email: "john.k@nenes.co.ke" },
              { name: "Sarah Nyambura", role: "Manager", email: "sarah.n@nenes.co.ke" },
              { name: "Grace Wanjiku", role: "Editor", email: "grace.w@nenes.co.ke" },
              { name: "Peter Omondi", role: "Viewer", email: "peter.o@nenes.co.ke" },
            ].map((user) => (
              <div key={user.email} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">{user.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 p-5 rounded-xl bg-[var(--color-section-alt)] border border-[var(--color-card-border)]">
        <Save className="w-5 h-5 text-[var(--color-muted)]" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--color-foreground)]">Unsaved changes</p>
          <p className="text-xs text-[var(--color-muted)]">Some settings have been modified</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm py-2 flex items-center gap-1">
            <RefreshCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button className="btn-primary text-sm py-2 flex items-center gap-1">
            <Save className="w-3.5 h-3.5" /> Save All
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "workers", label: "Workers", icon: Users },
    { id: "materials", label: "Materials", icon: Package },
    { id: "downloads", label: "Downloads", icon: FileDown },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--color-foreground)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">Manage workers, materials, and download reports.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[var(--color-section-alt)] border border-[var(--color-card-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[var(--color-card-bg)] text-[var(--color-foreground)] shadow-sm border border-[var(--color-card-border)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === "workers" && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-bold">
                {workers.length}
              </span>
            )}
            {tab.id === "materials" && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--color-highlight-soft)] text-[var(--color-highlight)] font-bold">
                {materials.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "workers" && <WorkersTab />}
      {activeTab === "materials" && <MaterialsTab />}
      {activeTab === "downloads" && <DownloadsTab />}
      {activeTab === "reports" && <ReportsTab />}
      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}
