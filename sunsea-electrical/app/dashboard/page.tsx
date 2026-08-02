"use client";

import { useState, useMemo } from "react";
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
  PieChart,
  PiggyBank,
  Gauge,
  Activity,
  BatteryCharging,
  Save,
  RefreshCcw,
  Bell,
  ShieldCheck,
  UserPlus,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Award,
  Briefcase,
  Target,
  Zap,
  Sun,
  Cpu,
  Building,
  Home,
  Factory,
  Wrench,
  ClipboardCheck,
  MessageCircle,
  HelpCircle,
  LifeBuoy,
  CreditCard,
  Receipt,
  Truck,
  Shield,
  Star,
  Headphones,
  Globe,
  Lock,
  Key,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const workers = [
  { id: 1, name: "John Kariuki", role: "Senior Electrician", phone: "+254 712 345 678", email: "john.k@sunsea.co.ke", status: "Active", projects: 12, rate: 2500, joined: "2020-03-15", skills: ["Industrial", "Automation", "Safety"], rating: 4.8 },
  { id: 2, name: "Grace Wanjiku", role: "Electrical Engineer", phone: "+254 723 456 789", email: "grace.w@sunsea.co.ke", status: "Active", projects: 8, rate: 3500, joined: "2019-06-01", skills: ["Solar", "Design", "Project Management"], rating: 4.9 },
  { id: 3, name: "Peter Omondi", role: "Solar Technician", phone: "+254 734 567 890", email: "peter.o@sunsea.co.ke", status: "Active", projects: 15, rate: 2000, joined: "2021-01-10", skills: ["Solar", "Installation", "Maintenance"], rating: 4.7 },
  { id: 4, name: "Sarah Nyambura", role: "Project Manager", phone: "+254 745 678 901", email: "sarah.n@sunsea.co.ke", status: "Active", projects: 20, rate: 4500, joined: "2018-09-20", skills: ["Management", "Planning", "Client Relations"], rating: 4.9 },
  { id: 5, name: "David Mwangi", role: "Apprentice", phone: "+254 756 789 012", email: "david.m@sunsea.co.ke", status: "On Leave", projects: 3, rate: 1200, joined: "2022-08-05", skills: ["Basic Electrical", "Learning"], rating: 4.2 },
  { id: 6, name: "Mary Akinyi", role: "Safety Officer", phone: "+254 767 890 123", email: "mary.a@sunsea.co.ke", status: "Active", projects: 18, rate: 3000, joined: "2020-11-15", skills: ["Safety", "Compliance", "Training"], rating: 4.8 },
  { id: 7, name: "James Otieno", role: "Automation Specialist", phone: "+254 778 901 234", email: "james.o@sunsea.co.ke", status: "Active", projects: 9, rate: 3800, joined: "2019-12-01", skills: ["Automation", "PLC", "IoT"], rating: 4.6 },
  { id: 8, name: "Lucy Wangari", role: "Renewable Energy Expert", phone: "+254 789 012 345", email: "lucy.w@sunsea.co.ke", status: "Active", projects: 11, rate: 3200, joined: "2020-07-20", skills: ["Solar", "Wind", "Energy Storage"], rating: 4.7 },
];

const materials = [
  { id: 1, name: "Copper Wire 2.5mm (Roll)", qty: 45, unit: "Rolls", minStock: 20, price: 8500, supplier: "Nairobi Cables Ltd", category: "Cables" },
  { id: 2, name: "MCB 32A Single Pole", qty: 120, unit: "Pcs", minStock: 50, price: 450, supplier: "Schneider Kenya", category: "Switchgear" },
  { id: 3, name: "Solar Panel 450W Mono", qty: 30, unit: "Pcs", minStock: 10, price: 18000, supplier: "JA Solar East Africa", category: "Solar" },
  { id: 4, name: "PVC Conduit 20mm (3m)", qty: 200, unit: "Pcs", minStock: 80, price: 250, supplier: "AfriPipe Ltd", category: "Conduits" },
  { id: 5, name: "Inverter 5kW Hybrid", qty: 8, unit: "Pcs", minStock: 5, price: 85000, supplier: "Sunsynk Kenya", category: "Solar" },
  { id: 6, name: "Battery 200Ah Gel", qty: 15, unit: "Pcs", minStock: 8, price: 42000, supplier: "East Africa Batteries", category: "Solar" },
  { id: 7, name: "LED Floodlight 50W", qty: 60, unit: "Pcs", minStock: 25, price: 2800, supplier: "Philips Kenya", category: "Lighting" },
  { id: 8, name: "Distribution Board 12-Way", qty: 22, unit: "Pcs", minStock: 10, price: 6500, supplier: "Hager Kenya", category: "Panels" },
];

const projects = [
  { id: 1, name: "KCB Tower Backup System", status: "In Progress", progress: 75, workers: 5, deadline: "2025-04-15", budget: 1200000, spent: 980000, location: "Nairobi", client: "KCB Group", priority: "High" },
  { id: 2, name: "Mombasa Solar Farm", status: "Completed", progress: 100, workers: 8, deadline: "2025-03-01", budget: 2500000, spent: 2500000, location: "Mombasa", client: "Mombasa Solar Initiative", priority: "Medium" },
  { id: 3, name: "Eldoret Industrial Plant", status: "In Progress", progress: 45, workers: 6, deadline: "2025-05-20", budget: 1800000, spent: 720000, location: "Eldoret", client: "Eldoret Manufacturers", priority: "High" },
  { id: 4, name: "Nakuru Residential Solar", status: "Completed", progress: 100, workers: 3, deadline: "2025-02-28", budget: 600000, spent: 600000, location: "Nakuru", client: "Green Homes Ltd", priority: "Low" },
  { id: 5, name: "Kisumu Mall Electrical", status: "Planning", progress: 10, workers: 2, deadline: "2025-06-15", budget: 1500000, spent: 150000, location: "Kisumu", client: "Kisumu Mall Developers", priority: "Medium" },
  { id: 6, name: "Nairobi Hospital Backup", status: "In Progress", progress: 60, workers: 4, deadline: "2025-04-30", budget: 2000000, spent: 1200000, location: "Nairobi", client: "Nairobi Hospital", priority: "High" },
];

// ─── Helper Components ──────────────────────────────────────────────────────

/** Badge component for status indicators */
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
    "On Leave": { bg: "bg-[#f9ad07]/10", text: "text-[#f9ad07]", dot: "bg-[#f9ad07]" },
    Completed: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
    "In Progress": { bg: "bg-[#f9ad07]/10", text: "text-[#f9ad07]", dot: "bg-[#f9ad07]" },
    Planning: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  };
  const v = variants[status] || variants.Active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${v.bg} ${v.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {status}
    </span>
  );
}

/** Priority badge */
function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, string> = {
    High: "bg-red-500/10 text-red-600 dark:text-red-400",
    Medium: "bg-[#f9ad07]/10 text-[#f9ad07]",
    Low: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[priority] || variants.Medium}`}>
      {priority}
    </span>
  );
}

/** Stat Card component */
function StatCard({ icon: Icon, label, value, change, color }: any) {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#f9ad07] group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{change}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
      </div>
    </div>
  );
}

// ─── Tab Components ──────────────────────────────────────────────────────────

/** Overview Tab - Dashboard home with stats, activities, and quick actions */
function OverviewTab() {
  const stats = [
    { icon: Users, label: "Total Workers", value: "24", change: "+3 this month", color: "blue-500" },
    { icon: Package, label: "Material Items", value: "156", change: "12 low stock", color: "[#f9ad07]" },
    { icon: TrendingUp, label: "Active Projects", value: "6", change: "2 completing soon", color: "green-500" },
    { icon: DollarSign, label: "Monthly Payroll", value: "KES 1.2M", change: "8 workers paid", color: "purple-500" },
  ];

  const recentActivities = [
    { action: "John Kariuki clocked in", time: "2 min ago", icon: Users },
    { action: "Materials inventory updated", time: "15 min ago", icon: Package },
    { action: "KCB Tower progress reached 75%", time: "1 hour ago", icon: TrendingUp },
    { action: "New worker added: James Otieno", time: "3 hours ago", icon: UserPlus },
    { action: "Monthly payroll processed", time: "5 hours ago", icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Projects</h3>
            <Link href="/dashboard?tab=projects" className="text-sm text-[#f9ad07] hover:underline hover:scale-105 transition-transform">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 hover:border-[#f9ad07] transition-all duration-300">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={p.status} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{p.workers} workers</span>
                  </div>
                </div>
                <div className="w-20">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${p.progress === 100 ? "bg-green-500" : "bg-[#f9ad07]"}`} style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{p.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-[#f9ad07]/10 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-4 h-4 text-[#f9ad07]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#f9ad07] group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f9ad07]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileDown className="w-6 h-6 text-[#f9ad07]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Download Attendance</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Worker records for Feb 2025</p>
            </div>
          </div>
          <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold text-sm hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Download className="w-4 h-4" /> Download .xlsx
          </button>
        </div>
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#f9ad07] group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Payment Summary</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Feb 2025 payments</p>
            </div>
          </div>
          <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Download className="w-4 h-4" /> Download .xlsx
          </button>
        </div>
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#f9ad07] group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Generate Report</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Custom project report</p>
            </div>
          </div>
          <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <FileSpreadsheet className="w-4 h-4" /> Generate
          </button>
        </div>
      </div>
    </div>
  );
}

/** Workers Tab - Manage team members */
function WorkersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [expandedWorker, setExpandedWorker] = useState<number | null>(null);

  const roles = ["All", ...new Set(workers.map(w => w.role))];
  const filtered = useMemo(() => {
    return workers.filter(w => {
      const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            w.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "All" || w.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workers</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your team members and their assignments</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#f9ad07] focus:outline-none focus:ring-2 focus:ring-[#f9ad07]/20 transition-all duration-300 w-48"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-sm text-gray-900 dark:text-white focus:border-[#f9ad07] focus:outline-none transition-all duration-300"
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold text-sm hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Add Worker
          </button>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((w) => (
          <div key={w.id} className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#f9ad07]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f9ad07]/20 flex items-center justify-center text-lg font-bold text-[#f9ad07]">
                  {w.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{w.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{w.role}</p>
                </div>
              </div>
              <StatusBadge status={w.status} />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4" /> {w.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4" /> {w.email}
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" /> Joined {w.joined}
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Briefcase className="w-4 h-4" /> {w.projects} projects
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">KES {w.rate.toLocaleString()}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/day</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-[#f9ad07]">{w.rating}</span>
                <Star className="w-4 h-4 text-[#f9ad07] fill-[#f9ad07]" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {w.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="px-2 py-0.5 bg-gray-100 dark:bg-[#0f172a] rounded-full text-xs text-gray-600 dark:text-gray-400">
                  {skill}
                </span>
              ))}
              {w.skills.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-[#0f172a] rounded-full text-xs text-gray-600 dark:text-gray-400">
                  +{w.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Materials Tab - Inventory management */
function MaterialsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...new Set(materials.map(m => m.category))];
  const filtered = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || m.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, filterCategory]);

  const lowStock = filtered.filter(m => m.qty <= m.minStock);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Materials Inventory</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your materials stock</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#f9ad07] focus:outline-none focus:ring-2 focus:ring-[#f9ad07]/20 transition-all duration-300 w-48"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-sm text-gray-900 dark:text-white focus:border-[#f9ad07] focus:outline-none transition-all duration-300"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold text-sm hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Add Material
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{lowStock.length} materials are low on stock</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Consider reordering soon to avoid project delays.</p>
          </div>
        </div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((m) => {
          const isLow = m.qty <= m.minStock;
          return (
            <div key={m.id} className={`bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg ${isLow ? "border-red-500/30 hover:border-red-500" : "border-gray-200 dark:border-gray-700 hover:border-[#f9ad07]"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${isLow ? "bg-red-500/10" : "bg-[#f9ad07]/10"} flex items-center justify-center`}>
                    <Package className={`w-5 h-5 ${isLow ? "text-red-500" : "text-[#f9ad07]"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.category}</p>
                  </div>
                </div>
                {isLow && (
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">Low Stock</span>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Quantity</span>
                  <span className={`font-medium ${isLow ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                    {m.qty} {m.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Unit Price</span>
                  <span className="text-gray-900 dark:text-white">KES {m.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Total Value</span>
                  <span className="font-medium text-gray-900 dark:text-white">KES {(m.qty * m.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Min Stock</span>
                  <span className="text-gray-900 dark:text-white">{m.minStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Supplier</span>
                  <span className="text-gray-900 dark:text-white text-right text-xs">{m.supplier}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-[#f9ad07]/10 text-[#f9ad07] rounded-lg text-xs font-medium hover:bg-[#f9ad07] hover:text-[#00255e] transition-all duration-300">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0f172a] text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium hover:bg-red-500/10 hover:text-red-500 transition-all duration-300">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Projects Tab - Project management */
function ProjectsTab() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  const statuses = ["All", "In Progress", "Completed", "Planning"];
  const priorities = ["All", "High", "Medium", "Low"];

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesStatus = filterStatus === "All" || p.status === filterStatus;
      const matchesPriority = filterPriority === "All" || p.priority === filterPriority;
      return matchesStatus && matchesPriority;
    });
  }, [filterStatus, filterPriority]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Projects</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all your electrical projects</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-sm text-gray-900 dark:text-white focus:border-[#f9ad07] focus:outline-none transition-all duration-300"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2e] text-sm text-gray-900 dark:text-white focus:border-[#f9ad07] focus:outline-none transition-all duration-300"
          >
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold text-sm hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#f9ad07] group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#f9ad07] transition-colors duration-300">{p.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{p.client} • {p.location}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={p.status} />
                <PriorityBadge priority={p.priority} />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{p.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${p.progress === 100 ? "bg-green-500" : "bg-[#f9ad07]"}`} style={{ width: `${p.progress}%` }} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" /> {p.workers}
                </span>
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <DollarSign className="w-4 h-4" /> KES {p.spent.toLocaleString()}
                </span>
              </div>
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" /> Due: {p.deadline}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-[#f9ad07]/10 text-[#f9ad07] rounded-lg text-sm font-medium hover:bg-[#f9ad07] hover:text-[#00255e] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <Eye className="w-4 h-4" /> View Details
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#0f172a] text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#1a1f2e] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Downloads Tab - Document management */
function DownloadsTab() {
  const downloads = [
    { id: 1, name: "Attendance Record", icon: FileSpreadsheet, color: "text-[#f9ad07]", bg: "bg-[#f9ad07]/10", desc: "Worker daily attendance for February 2025", date: "Feb 2025", extra: "24 workers", action: "Download" },
    { id: 2, name: "Payment Summary", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", desc: "February 2025 worker payments", date: "Feb 2025", extra: "KES 1,245,000", action: "Download" },
    { id: 3, name: "Project Report", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Progress, budget, and resource tracking", date: "Feb 2025", extra: "6 projects", action: "Generate" },
    { id: 4, name: "Inventory Report", icon: Package, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Stock levels and material usage", date: "Feb 2025", extra: "156 items", action: "Generate" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Document Downloads</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Download attendance records, payment summaries, and reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloads.map((d) => (
          <div key={d.id} className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:border-[#f9ad07] group">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl ${d.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <d.icon className={`w-7 h-7 ${d.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{d.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{d.desc}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {d.date}</span>
                  <span className="flex items-center gap-1"><HardHat className="w-3 h-3" /> {d.extra}</span>
                </div>
                <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#f9ad07] text-[#00255e] rounded-xl font-semibold text-sm hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  <Download className="w-4 h-4" /> {d.action} {d.name}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Reports Tab - Analytics and insights */
function ReportsTab() {
  const stats = [
    { icon: DollarSign, label: "Total Revenue", value: "KES 4.8M", change: "+12% vs last month", color: "green-500" },
    { icon: PiggyBank, label: "Project Budget", value: "KES 6.2M", change: "78% utilized", color: "[#f9ad07]" },
    { icon: Gauge, label: "Avg. Project Time", value: "45 days", change: "2 days ahead", color: "blue-500" },
    { icon: Activity, label: "Efficiency Rate", value: "94%", change: "+3% improvement", color: "purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Financial, project, and operational performance reports.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Overview */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Project Budget Overview</h3>
          <div className="space-y-4">
            {projects.map((p) => {
              const pct = Math.round((p.spent / p.budget) * 100);
              return (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">KES {p.spent.toLocaleString()} / KES {p.budget.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? "bg-green-500" : "bg-[#f9ad07]"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Worker Productivity */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Worker Productivity</h3>
          <div className="space-y-4">
            {workers.slice(0, 5).map((w) => (
              <div key={w.id} className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-all duration-300">
                <div className="w-9 h-9 rounded-full bg-[#f9ad07]/20 flex items-center justify-center text-sm font-bold text-[#f9ad07]">
                  {w.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{w.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{w.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#f9ad07]">{w.projects} projects</span>
                  <div className="flex items-center justify-end gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(w.rating) ? "text-[#f9ad07] fill-[#f9ad07]" : "text-gray-300 dark:text-gray-600"}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Settings Tab - Dashboard configuration */
function SettingsTab() {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    milestones: true,
    attendance: false,
    payments: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage dashboard preferences, notifications, and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-[#f9ad07]" /> General
          </h3>
          <div className="space-y-4">
            {[
              { label: "Company Name", value: "SunSea Electrical Ltd" },
              { label: "Currency", value: "KES (Kenyan Shilling)" },
              { label: "Time Zone", value: "EAT (UTC+3)" },
              { label: "Date Format", value: "DD/MM/YYYY" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-all duration-300">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.value}</p>
                </div>
                <button className="text-xs text-[#f9ad07] hover:underline hover:scale-105 transition-transform">Edit</button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#f9ad07]" /> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { key: "lowStock" as const, label: "Low stock alerts", desc: "When materials fall below minimum stock" },
              { key: "milestones" as const, label: "Project milestone updates", desc: "When a project reaches 50%, 75%, 100%" },
              { key: "attendance" as const, label: "Worker attendance anomalies", desc: "Missed check-ins or unusual patterns" },
              { key: "payments" as const, label: "Payment reminders", desc: "Weekly payroll due reminders" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-all duration-300">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{n.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{n.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(n.key)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none ${notifications[n.key] ? "bg-[#f9ad07]" : "bg-gray-300 dark:bg-gray-600"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${notifications[n.key] ? "translate-x-4" : "translate-x-0.5"} mt-0.5`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-[#f9ad07]" /> Security
          </h3>
          <div className="space-y-4">
            {[
              { label: "Two-Factor Auth", desc: "Extra layer of security for your account", action: "Toggle" },
              { label: "Password", desc: "Last changed 30 days ago", action: "Change" },
              { label: "Session Timeout", desc: "30 minutes of inactivity", action: "Edit" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-all duration-300">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                {item.label === "Two-Factor Auth" ? (
                  <button className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300 focus:outline-none hover:bg-[#f9ad07]">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 translate-x-0.5 mt-0.5" />
                  </button>
                ) : (
                  <button className="text-xs text-[#f9ad07] hover:underline hover:scale-105 transition-transform">{item.action}</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team Access */}
        <div className="bg-white dark:bg-[#1a1f2e] rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-[#f9ad07]" /> Team Access
          </h3>
          <div className="space-y-4">
            {workers.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f9ad07]/20 flex items-center justify-center text-xs font-bold text-[#f9ad07]">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  user.role === "Project Manager" ? "bg-[#f9ad07]/10 text-[#f9ad07]" : "bg-gray-100 dark:bg-[#0f172a] text-gray-600 dark:text-gray-400"
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#f9ad07]/10 text-[#f9ad07] rounded-xl font-semibold text-sm hover:bg-[#f9ad07] hover:text-[#00255e] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <UserPlus className="w-4 h-4" /> Invite Team Member
            </button>
          </div>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex flex-wrap items-center gap-3 p-5 rounded-2xl bg-[#f9ad07]/5 border border-[#f9ad07]/20">
        <Save className="w-5 h-5 text-[#f9ad07]" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Unsaved changes</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Some settings have been modified</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm hover:bg-gray-100 dark:hover:bg-[#0f172a] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <RefreshCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#f9ad07] text-[#00255e] rounded-xl font-medium text-sm hover:bg-[#e09c00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Save className="w-3.5 h-3.5" /> Save All
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "workers", label: "Workers", icon: Users, count: workers.length },
    { id: "materials", label: "Materials", icon: Package, count: materials.length },
    { id: "projects", label: "Projects", icon: Calendar, count: projects.length },
    { id: "downloads", label: "Downloads", icon: FileDown },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "workers": return <WorkersTab />;
      case "materials": return <MaterialsTab />;
      case "projects": return <ProjectsTab />;
      case "downloads": return <DownloadsTab />;
      case "reports": return <ReportsTab />;
      case "settings": return <SettingsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage workers, materials, projects, and reports.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-[#0f172a] rounded-2xl border border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-white dark:bg-[#1a1f2e] text-gray-900 dark:text-white shadow-md border border-gray-200 dark:border-gray-700"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#1a1f2e]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#f9ad07]/10 text-[#f9ad07] font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
}