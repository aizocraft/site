'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Users, Plus, Search, Trash2, Pencil, X, Wallet, Eye, Filter
} from 'lucide-react';
import { useWorkers, useSites } from '@/lib/useConstructionData';
import { constructionApi, formatNaira, getStatusColor, getInitials } from '@/lib/construction';

const roles = ['Mason', 'Electrician', 'Welder', 'Plumber', 'Labourer', 'Carpenter', 'Foreman', 'Painter', 'Scaffolder', 'Site Clerk', 'Steel Fixer', 'Tiler'];

const inputClass = 'w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function WorkersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: workers, isLoading } = useWorkers({ search, status: 'all' });
  const { data: sites = [] } = useSites();

  const filtered = useMemo(() => {
    if (!workers) return [];
    if (role === 'all') return workers;
    return workers.filter((w: any) => w.role === role);
  }, [workers, role]);

  const uniqueRoles = useMemo(() => Array.from(new Set((workers || []).map((w: any) => w.role))), [workers]);

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (w: any) => { setEditing(w); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this worker?')) return;
    try {
      await constructionApi.deleteWorker(id);
      toast.success('Worker deleted');
      queryClient.invalidateQueries({ queryKey: ['construction-workers'] });
      queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
      queryClient.invalidateQueries({ queryKey: ['construction-sites'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to delete worker');
    }
  };

  const handlePay = async (worker: any) => {
    const amount = worker.dailyRate * 20; // approx monthly
    if (!confirm(`Process payment of ${formatNaira(amount)} for ${worker.firstName} ${worker.lastName}?`)) return;
    try {
      await constructionApi.createPayment({
        recipientType: 'worker',
        recipient: worker._id,
        recipientName: `${worker.firstName} ${worker.lastName}`,
        site: worker.site,
        siteName: worker.siteName,
        amount,
        status: 'paid',
        paymentMethod: 'Cash',
        periodStart: new Date().toISOString(),
        periodEnd: new Date().toISOString(),
      });
      toast.success('Payment recorded');
      queryClient.invalidateQueries({ queryKey: ['construction-payments'] });
      queryClient.invalidateQueries({ queryKey: ['construction-workers'] });
      queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Payment failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Users className="w-6 h-6 text-orange-600" /> Workers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All site workers, roles, and earnings</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-medium shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] self-start">
          <Plus className="w-4 h-4" /> Add Worker
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option value="all">All Roles</option>
            {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} workers</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search workers or site..." className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4">Worker</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Site</th>
                <th className="px-4 py-4">Daily Rate</th>
                <th className="px-4 py-4">Attendance</th>
                <th className="px-4 py-4">Total Earned</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((w: any) => (
                <tr key={w._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {getInitials(w.firstName, w.lastName)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{w.firstName} {w.lastName}</p>
                        <p className="text-xs text-gray-400 font-mono">{w.workerCode} · {w.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{w.role}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{w.siteName || '—'}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatNaira(w.dailyRate)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${w.attendanceRate >= 75 ? 'bg-emerald-500' : w.attendanceRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${w.attendanceRate}%` }} />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{w.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatNaira(w.totalEarned)}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(w.status)}`}>{w.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handlePay(w)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600" title="Pay"><Wallet className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(w)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(w._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No workers found</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <WorkerModal
          worker={editing}
          sites={sites}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['construction-workers'] });
            queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
            queryClient.invalidateQueries({ queryKey: ['construction-sites'] });
          }}
        />
      )}
    </div>
  );
}

function WorkerModal({ worker, sites, onClose, onSaved }: {
  worker: any;
  sites: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    firstName: worker?.firstName || '',
    lastName: worker?.lastName || '',
    phone: worker?.phone || '',
    role: worker?.role || roles[0],
    site: worker?.site || '',
    dailyRate: worker?.dailyRate || '',
    status: worker?.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const selectedSite = sites.find((s: any) => s._id === form.site);
      const data = {
        ...form,
        dailyRate: Number(form.dailyRate) || 0,
        site: form.site || undefined,
        siteName: selectedSite?.name || undefined,
      };
      if (worker?._id) {
        await constructionApi.updateWorker(worker._id, data);
        toast.success('Worker updated');
      } else {
        await constructionApi.createWorker(data);
        toast.success('Worker added');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save worker');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{worker?._id ? 'Edit Worker' : 'Add Worker'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name *"><input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} /></Field>
            <Field label="Last Name *"><input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} /></Field>
            <Field label="Phone Number *"><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+234 803 000 0000" /></Field>
            <Field label="Role *">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Assign to Site">
              <select value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} className={inputClass}>
                <option value="">No assignment</option>
                {sites.filter((s: any) => s.status !== 'completed').map((s: any) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Daily Rate (₦) *"><input required type="number" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: e.target.value })} className={inputClass} placeholder="8500" /></Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium shadow-lg shadow-orange-500/30 hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : worker?._id ? 'Update Worker' : 'Add Worker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
