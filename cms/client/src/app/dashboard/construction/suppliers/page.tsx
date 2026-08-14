'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Truck, Plus, Search, Trash2, Pencil, X, Mail, Phone, MapPin, Building2
} from 'lucide-react';
import { useSuppliers } from '@/lib/useConstructionData';
import { constructionApi, getStatusColor } from '@/lib/construction';

const inputClass = 'w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function SuppliersPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: suppliers, isLoading } = useSuppliers();

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (s: any) => { setEditing(s); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await constructionApi.deleteSupplier(id);
      toast.success('Supplier deleted');
      queryClient.invalidateQueries({ queryKey: ['construction-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['construction-materials'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to delete supplier');
    }
  };

  const handleToggleStatus = async (s: any) => {
    const newStatus = s.status === 'active' ? 'inactive' : 'active';
    try {
      await constructionApi.updateSupplier(s._id, { status: newStatus });
      toast.success(`Supplier ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['construction-suppliers'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to update supplier');
    }
  };

  const stats = useMemo(() => {
    const all = suppliers || [];
    return {
      total: all.length,
      active: all.filter(s => s.status === 'active').length,
      inactive: all.filter(s => s.status === 'inactive').length,
    };
  }, [suppliers]);

  const statCards = [
    { name: 'Total Suppliers', value: stats.total, icon: Truck, color: 'from-cyan-500 to-blue-600' },
    { name: 'Active', value: stats.active, icon: Building2, color: 'from-emerald-500 to-green-600' },
    { name: 'Inactive', value: stats.inactive, icon: Building2, color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Truck className="w-6 h-6 text-cyan-600" /> Suppliers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage material suppliers and vendors</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] self-start">
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(suppliers || []).map((s: any) => (
            <div key={s._id} className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(s.status)}`}>{s.status}</span>
              </div>
<h3 className="font-semibold text-gray-900 dark:text-white text-lg">{s.companyName}</h3>
              {s.category && (
                <p className="text-xs text-gray-400 font-mono mb-4">{s.category}</p>
              )}
              <div className="space-y-2 text-sm">
                {s.email && (
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Mail className="w-4 h-4 text-gray-400" /> {s.email}</p>
                )}
                {s.phone && (
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Phone className="w-4 h-4 text-gray-400" /> {s.phone}</p>
                )}
                {s.address && (
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><MapPin className="w-4 h-4 text-gray-400" /> {s.address}</p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button onClick={() => openEdit(s)} className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleToggleStatus(s)} className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {s.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(s._id)} className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {(suppliers || []).length === 0 && !isLoading && (
            <div className="col-span-full text-center py-16">
              <Truck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No suppliers found</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <SupplierModal
          supplier={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['construction-suppliers'] });
            queryClient.invalidateQueries({ queryKey: ['construction-materials'] });
          }}
        />
      )}
    </div>
  );
}

function SupplierModal({ supplier, onClose, onSaved }: {
  supplier: any;
  onClose: () => void;
  onSaved: () => void;
}) {
const [form, setForm] = useState({
    companyName: supplier?.companyName || '',
    contactName: supplier?.contactName || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    category: supplier?.category || '',
    materials: supplier?.materials || [],
    paymentTerms: supplier?.paymentTerms || 'Net 30',
    leadTimeDays: supplier?.leadTimeDays || 7,
    status: supplier?.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (supplier?._id) {
        await constructionApi.updateSupplier(supplier._id, form);
        toast.success('Supplier updated');
      } else {
        await constructionApi.createSupplier(form);
        toast.success('Supplier added');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save supplier');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{supplier?._id ? 'Edit Supplier' : 'Add Supplier'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Company Name *"><input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className={inputClass} placeholder="e.g. DangCem Industries" /></Field>
<Field label="Contact Person"><input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className={inputClass} placeholder="e.g. Mr. Adewale" /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="supplier@company.com" /></Field>
            <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+234 800 000 0000" /></Field>
          </div>
          <Field label="Address"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} placeholder="e.g. Lagos Industrial Area" /></Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/30 hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : supplier?._id ? 'Update Supplier' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
