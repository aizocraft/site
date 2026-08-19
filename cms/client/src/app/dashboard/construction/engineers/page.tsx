'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  HardHat, Plus, Search, Mail, Phone, Calendar, Trash2, Pencil, X, Briefcase
} from 'lucide-react';
import { useEngineers, useSites } from '@/lib/useConstructionData';
import { constructionApi, formatCurrency, getStatusColor, getInitials, getProgressColor } from '@/lib/construction';

const specialties = ['Civil Engineering', 'Structural Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Environmental Engineering', 'Architecture', 'Quantity Surveying'];

const inputClass = 'w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function EngineersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: engineers, isLoading } = useEngineers({ search });
  const { data: sites = [] } = useSites();

  const filtered = useMemo(() => engineers || [], [engineers]);

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (en: any) => { setEditing(en); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this engineer?')) return;
    try {
      await constructionApi.deleteEngineer(id);
      toast.success('Engineer deleted');
      queryClient.invalidateQueries({ queryKey: ['construction-engineers'] });
      queryClient.invalidateQueries({ queryKey: ['construction-sites'] });
      queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to delete engineer');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-6 h-6 text-indigo-600" /> Engineers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Site engineers and project supervisors</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] self-start"
        >
          <Plus className="w-4 h-4" /> Add Engineer
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{filtered.length} Engineers Registered</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search engineers..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((en: any) => (
            <div key={en._id} className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                      {getInitials(en.firstName, en.lastName)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{en.firstName} {en.lastName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{en.specialty}</p>
                      <p className="font-mono text-[10px] text-gray-400 mt-0.5">{en.engineerCode}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(en.status)}`}>{en.status}</span>
                </div>
              </div>
              <div className="p-5 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Mail className="w-4 h-4 text-gray-400" /> <span className="truncate">{en.email}</span></p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Phone className="w-4 h-4 text-gray-400" /> {en.phone}</p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Calendar className="w-4 h-4 text-gray-400" /> {en.experienceYears} years experience</p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Briefcase className="w-4 h-4 text-gray-400" /> Salary: {formatCurrency(en.monthlySalary)}/mo</p>
              </div>
              <div className="px-5 pb-5">
                <p className="text-xs text-gray-400 mb-1">Assigned Site</p>
                {en.assignedSiteName ? (
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{en.assignedSiteName}</p>
                    <div className="mt-1 h-1.5 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${getProgressColor(80)} rounded-full`} style={{ width: '80%' }} />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No site assigned</p>
                )}
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <button onClick={() => openEdit(en)} className="flex-1 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 transition-colors">View Profile</button>
                <button onClick={() => openEdit(en)} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(en._id)} className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <HardHat className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No engineers found</p>
        </div>
      )}

      {showModal && (
        <EngineerModal
          engineer={editing}
          sites={sites}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['construction-engineers'] });
            queryClient.invalidateQueries({ queryKey: ['construction-sites'] });
            queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
          }}
        />
      )}
    </div>
  );
}

function EngineerModal({ engineer, sites, onClose, onSaved }: {
  engineer: any;
  sites: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    firstName: engineer?.firstName || '',
    lastName: engineer?.lastName || '',
    email: engineer?.email || '',
    phone: engineer?.phone || '',
    specialty: engineer?.specialty || specialties[0],
    experienceYears: engineer?.experienceYears || '',
    licenseNo: engineer?.licenseNo || '',
    assignedSite: engineer?.assignedSite || '',
    monthlySalary: engineer?.monthlySalary || '',
    status: engineer?.status || 'active',
    notes: engineer?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        experienceYears: Number(form.experienceYears) || 0,
        monthlySalary: Number(form.monthlySalary) || 0,
        assignedSite: form.assignedSite || undefined,
      };
      if (engineer?._id) {
        await constructionApi.updateEngineer(engineer._id, data);
        toast.success('Engineer updated');
      } else {
        await constructionApi.createEngineer(data);
        toast.success('Engineer added');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save engineer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{engineer?._id ? 'Edit Engineer' : 'Add Engineer'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-indigo-600 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name *"><input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} placeholder="Emeka" /></Field>
              <Field label="Last Name *"><input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} placeholder="Okafor" /></Field>
              <Field label="Email Address *"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="engineer@buildcorp.ng" /></Field>
              <Field label="Phone Number *"><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+234 803 000 0000" /></Field>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-600 mb-3">Professional Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Specialty *">
                <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className={inputClass}>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Years of Experience"><input type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} className={inputClass} placeholder="e.g. 8" /></Field>
              <div className="sm:col-span-2">
                <Field label="Professional License No."><input value={form.licenseNo} onChange={(e) => setForm({ ...form, licenseNo: e.target.value })} className={inputClass} placeholder="COREN/2024/12345" /></Field>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-600 mb-3">Assignment & Compensation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Assign to Site">
                <select value={form.assignedSite} onChange={(e) => setForm({ ...form, assignedSite: e.target.value })} className={inputClass}>
                  <option value="">No assignment yet</option>
                  {sites.filter((s: any) => s.status !== 'completed').map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Monthly Salary"><input type="number" value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })} className={inputClass} placeholder="350000" /></Field>
              <div className="sm:col-span-2">
                <Field label="Notes"><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} rows={3} /></Field>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : engineer?._id ? 'Update Engineer' : 'Add Engineer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}