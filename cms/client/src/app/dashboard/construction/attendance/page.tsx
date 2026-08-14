'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ClipboardCheck, Search, Calendar, CheckCircle2, XCircle, Clock, Sun
} from 'lucide-react';
import { useAttendance, useWorkers, useSites } from '@/lib/useConstructionData';
import { constructionApi, getStatusColor } from '@/lib/construction';

const statuses = [
  { value: 'present', label: 'Present', icon: CheckCircle2, color: 'text-emerald-600' },
  { value: 'absent', label: 'Absent', icon: XCircle, color: 'text-red-600' },
  { value: 'half_day', label: 'Half Day', icon: Clock, color: 'text-amber-600' },
  { value: 'late', label: 'Late', icon: Sun, color: 'text-orange-600' },
];

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [siteFilter, setSiteFilter] = useState('all');

  const { data: attendance, isLoading } = useAttendance({ date, site: siteFilter });
  const { data: workers = [] } = useWorkers({ status: 'active' });
  const { data: sites = [] } = useSites();

  const activeWorkers = useMemo(() => {
    if (siteFilter === 'all') return workers;
    return workers.filter((w: any) => w.site === siteFilter);
  }, [workers, siteFilter]);

  const existingRecords = useMemo(() => {
    const map: Record<string, any> = {};
    (attendance || []).forEach((a: any) => { map[a.worker] = a; });
    return map;
  }, [attendance]);

  const handleMark = async (worker: any, status: string) => {
    try {
      await constructionApi.createAttendance({ worker: worker._id, date, status });
      toast.success(`${worker.firstName} marked ${status}`);
      queryClient.invalidateQueries({ queryKey: ['construction-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['construction-workers'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to mark attendance');
    }
  };

  const summary = useMemo(() => {
    const all = attendance || [];
    return {
      present: all.filter(a => a.status === 'present').length,
      absent: all.filter(a => a.status === 'absent').length,
      half_day: all.filter(a => a.status === 'half_day').length,
      late: all.filter(a => a.status === 'late').length,
      total: all.length,
    };
  }, [attendance]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-rose-600" /> Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Daily worker attendance tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option value="all">All Sites</option>
            {sites.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statuses.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.value} className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary[s.value as keyof typeof summary]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workers list */}
      <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Mark Attendance</h3>
            <p className="text-xs text-gray-400">{activeWorkers.length} active workers · {new Date(date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {activeWorkers.map((w: any) => {
            const record = existingRecords[w._id];
            return (
              <div key={w._id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {(w.firstName || 'W')[0]}{(w.lastName || '')[0] || ''}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{w.firstName} {w.lastName}</p>
                    <p className="text-xs text-gray-400">{w.role} · {w.siteName || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {record ? (
                    <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status.replace('_', ' ')} · {record.hoursWorked}h
                    </span>
                  ) : (
                    statuses.map((s) => {
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.value}
                          onClick={() => handleMark(w, s.value)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          title={s.label}
                        >
                          <Icon className={`w-4 h-4 ${s.color}`} /> <span className="hidden sm:inline">{s.label}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
          {activeWorkers.length === 0 && (
            <div className="text-center py-16">
              <ClipboardCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No active workers to mark</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
