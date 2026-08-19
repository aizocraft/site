'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Building2, Users, Wallet, AlertTriangle, TrendingUp, TrendingDown,
  ChevronRight, ArrowUpRight, Boxes, HardHat, CheckCircle2, Clock,
  XCircle, RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useOverview } from '@/lib/useConstructionData';
import { formatCurrency, getProgressColor, getInitials, getStatusColor } from '@/lib/construction';

export default function ConstructionDashboard() {
  const { data, isLoading, refetch, isFetching } = useOverview();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const stats = data?.stats;
  const sites = data?.sites || [];
  const payments = data?.payments || [];

  const chartData = useMemo(() => {
    if (!stats) return [];
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const spent = stats.totalSpent || 0;
    const variation = spent / 6;
    return months.map((m, i) => ({
      name: m,
      amount: Math.round(spent > 0 ? variation * (i + 1) * 0.6 : 0),
    }));
  }, [stats]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const statCards = [
    { name: 'Active Sites', value: stats?.activeSites ?? 0, subtitle: `${stats?.totalSites ?? 0} total sites`, icon: Building2, color: 'from-blue-500 to-indigo-600', trend: 'up', change: '+1 site' },
    { name: 'Active Workers', value: stats?.activeWorkers ?? 0, subtitle: 'Across all sites', icon: Users, color: 'from-emerald-500 to-green-600', trend: 'up', change: `+${stats?.activeWorkers ?? 0} workers` },
    { name: 'Total Budget', value: formatCurrency(stats?.totalBudget ?? 0), subtitle: 'All projects combined', icon: Wallet, color: 'from-amber-500 to-orange-600', trend: 'up', change: '+5%' },
    { name: 'Pending Payments', value: formatCurrency(stats?.pendingPayments ?? 0), subtitle: 'Requires action', icon: AlertTriangle, color: 'from-rose-500 to-red-600', trend: 'down', change: stats?.overdueAmount ? `${formatCurrency(stats.overdueAmount)}` : '0' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Overview Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time summary across all construction sites</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isFetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 self-start"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing || isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="relative bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 overflow-hidden group hover:shadow-lg transition-all">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>{stat.change}</span>
                <span className="text-xs text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            Monthly Expenditure
          </h3>
          <p className="text-xs text-gray-400 mb-4">Last 6 months across all sites</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => formatCurrency(v)} labelStyle={{ color: '#111' }} />
                <Bar dataKey="amount" fill="#2563eb" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HardHat className="w-5 h-5 text-emerald-600" />
            Site Progress
          </h3>
          <p className="text-xs text-gray-400 mb-4">Completion by project</p>
          <div className="space-y-4">
            {sites.slice(0, 6).map((site) => (
              <div key={site._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300 truncate pr-2">{site.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{site.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(site.progress)} rounded-full transition-all`} style={{ width: `${site.progress}%` }} />
                </div>
              </div>
            ))}
            {sites.length === 0 && (
              <p className="text-center text-gray-400 py-8">No sites created yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Active sites + Payment status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sites</h3>
            <Link href="/dashboard/construction/sites" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {sites.filter(s => s.status === 'active').slice(0, 4).map((site) => (
              <div key={site._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{site.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{site.location} · {site.workerCount} workers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{site.progress}%</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor('active')}`}>active</span>
                </div>
              </div>
            ))}
            {sites.filter(s => s.status === 'active').length === 0 && (
              <p className="text-center text-gray-400 py-8">No active sites</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Status</h3>
            <Link href="/dashboard/construction/payments" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-center p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
              <p className="text-lg font-bold text-emerald-600">{stats?.paidCount ?? 0}</p>
              <p className="text-xs text-gray-500">Paid</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <Clock className="w-4 h-4 text-amber-500 mx-auto" />
              <p className="text-lg font-bold text-amber-600">{stats?.pendingCount ?? 0}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="text-center p-2 rounded-xl bg-red-50 dark:bg-red-900/20">
              <XCircle className="w-4 h-4 text-red-500 mx-auto" />
              <p className="text-lg font-bold text-red-600">{stats?.overdueCount ?? 0}</p>
              <p className="text-xs text-gray-500">Overdue</p>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {payments.slice(0, 4).map((payment) => (
              <div key={payment._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300 shrink-0">
                    {getInitials(payment.recipientName.split(' ')[0] || 'P', payment.recipientName.split(' ')[1] || '')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{payment.recipientName}</p>
                    <p className="text-xs text-gray-400">{payment.periodStart ? new Date(payment.periodStart).toLocaleDateString() : ''} – {payment.periodEnd ? new Date(payment.periodEnd).toLocaleDateString() : ''}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                  <span className={`text-xs font-medium ${payment.status === 'paid' ? 'text-emerald-500' : payment.status === 'pending' ? 'text-amber-500' : 'text-red-500'}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-center text-gray-400 py-8">No payments yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Budget summary */}
      <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Budget</h3>
            <p className="text-xs text-gray-400">{stats?.totalSites ?? 0} active projects</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {stats && stats.totalBudget > 0 ? Math.round(((stats.totalBudget - stats.totalSpent) / stats.totalBudget) * 100) : 0}% of budget remaining
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Total Budget</p>
            <p className="text-xl font-bold text-blue-800 dark:text-blue-300 mt-1">{formatCurrency(stats?.totalBudget ?? 0)}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Amount Spent</p>
            <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">{formatCurrency(stats?.totalSpent ?? 0)}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Remaining</p>
            <p className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-1">{formatCurrency(stats?.remainingBudget ?? 0)}</p>
          </div>
        </div>
        <div className="mt-4 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${stats && stats.totalBudget > 0 ? Math.min(100, (stats.totalSpent / stats.totalBudget) * 100) : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}