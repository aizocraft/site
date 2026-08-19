'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Building2, Plus, Search, MapPin, Trash2, Pencil, X, ChevronRight, Users, Wallet
} from 'lucide-react';
import { useSites, useEngineers } from '@/lib/useConstructionData';
import { constructionApi, formatCurrency, getProgressColor, getStatusColor, getInitials } from '@/lib/construction';

const siteTypes = ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Roads & Bridges', 'Renovation'];

const inputClass = 'w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function SitesPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: sites, isLoading } = useSites({ status: filter, search });
  const { data: engineers = [] } = useEngineers();

  const filteredSites = useMemo(() => {
    if (!sites) return [];
    return sites;
  }, [sites]);

  const counts = useMemo(() => {
    const all = sites || [];
    return {
      all: all.length,
      active: all.filter(s => s.status === 'active').length,
      paused: all.filter(s => s.status === 'paused').length,
      completed: all.filter(s => s.status === 'completed').length,
    };
  }, [sites]);

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (site: any) => {
    setEditing(site);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this site? Engineers and workers assigned will be unassigned.')) return;
    try {
      await constructionApi.deleteSite(id);
      toast.success('Site deleted');
      queryClient.invalidateQueries({ queryKey: ['construction-sites'] });
      queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to delete site');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            Construction Sites
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all project sites</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] self-start"
        >
          <Plus className="w-4 h-4" /> Add Site
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-2">
          {['all', 'active', 'paused', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
              }`}
            >
              {f} ({counts[f as keyof typeof counts]})
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sites..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Sites grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSites.map((site: any) => (
            <div key={site._id} className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-gray-400">{site.siteCode}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{site.name}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                    {site.status}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-3">
                  <MapPin className="w-4 h-4 text-gray-400" /> {site.location}
                </p>
              </div>

              {/* Progress */}
              <div className="px-5 py-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{site.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${getProgressColor(site.progress)} rounded-full`} style={{ width: `${site.progress}%` }} />
                </div>
              </div>

              {/* Details */}
              <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-400">Engineer</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">{site.engineerName || 'Unassigned'}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-400">Workers</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1"><Users className="w-3 h-3" /> {site.workerCount || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(site.budget?.total || 0)}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-400">Spent</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(site.budget?.spent || 0)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 flex items-center gap-2">
                <button
                  onClick={() => openEdit(site)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" /> View details
                </button>
                <button
                  onClick={() => openEdit(site)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(site._id)}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredSites.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No sites found</p>
          <button onClick={openAdd} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">+ Add your first site</button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <SiteModal
          site={editing}
          engineers={engineers}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['construction-sites'] });
            queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
            queryClient.invalidateQueries({ queryKey: ['construction-engineers'] });
          }}
        />
      )}
    </div>
  );
}

function SiteModal({ site, engineers, onClose, onSaved }: {
  site: any;
  engineers: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: site?.name || '',
    siteType: site?.type || siteTypes[0],
    location: site?.location || '',
    engineer: site?.engineer || '',
    status: site?.status || 'active',
    startDate: site?.startDate ? new Date(site.startDate).toISOString().split('T')[0] : '',
    expectedEndDate: site?.expectedEndDate ? new Date(site.expectedEndDate).toISOString().split('T')[0] : '',
    budgetTotal: site?.budget?.total || '',
    progress: site?.progress || 0,
    amountSpent: site?.budget?.spent || '',
    clientName: site?.clientName || '',
    clientPhone: site?.clientPhone || '',
    description: site?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const total = Number(form.budgetTotal) || 0;
      const spent = Number(form.amountSpent) || 0;
      
      const data: any = {
        name: form.name,
        type: form.siteType.toLowerCase(),
        location: form.location,
        status: form.status,
        progress: Number(form.progress) || 0,
        budget: {
          total: total,
          spent: spent,
          remaining: Math.max(0, total - spent),
        },
        clientName: form.clientName || undefined,
        clientPhone: form.clientPhone || undefined,
        description: form.description || undefined,
      };
      
      if (form.startDate) data.startDate = form.startDate;
      if (form.expectedEndDate) data.expectedEndDate = form.expectedEndDate;
      if (form.engineer) data.engineer = form.engineer;

      if (site?._id) {
        await constructionApi.updateSite(site._id, data);
        toast.success('Site updated');
      } else {
        await constructionApi.createSite(data);
        toast.success('Site created');
      }
      onSaved();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to save site');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {site?._id ? 'Edit Site' : 'Add New Site'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Site info */}
          <div>
            <h4 className="text-sm font-semibold text-blue-600 mb-3">Site Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Site Name *">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Greenfield Tower Block B" />
              </Field>
              <Field label="Site Type *">
                <select value={form.siteType} onChange={(e) => setForm({ ...form, siteType: e.target.value })} className={inputClass}>
                  {siteTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Location / Address *">
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="e.g. Victoria Island, Lagos" />
              </Field>
              <Field label="Assign Engineer">
                <select value={form.engineer} onChange={(e) => setForm({ ...form, engineer: e.target.value })} className={inputClass}>
                  <option value="">Select engineer...</option>
                  {engineers.filter((en: any) => en.status === 'active').map((en: any) => (
                    <option key={en._id} value={en._id}>{en.firstName} {en.lastName}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Timeline & budget */}
          <div>
            <h4 className="text-sm font-semibold text-blue-600 mb-3">Timeline & Budget</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Start Date">
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Expected End Date">
                <input type="date" value={form.expectedEndDate} onChange={(e) => setForm({ ...form, expectedEndDate: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Total Budget *">
                <input required type="number" value={form.budgetTotal} onChange={(e) => setForm({ ...form, budgetTotal: e.target.value })} className={inputClass} placeholder="e.g. 5000000" />
              </Field>
              <Field label="Progress (%)">
                <input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Amount Spent">
                <input type="number" value={form.amountSpent} onChange={(e) => setForm({ ...form, amountSpent: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </div>

          {/* Client info */}
          <div>
            <h4 className="text-sm font-semibold text-blue-600 mb-3">Client Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Client Name">
                <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className={inputClass} placeholder="e.g. Zenith Properties Ltd" />
              </Field>
              <Field label="Client Phone">
                <input value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} className={inputClass} placeholder="+234 801 234 5678" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Project Description">
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} rows={3} placeholder="Brief description of the project scope and objectives..." />
                </Field>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium shadow-lg shadow-emerald-500/30 hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : site?._id ? 'Update Site' : 'Create Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}