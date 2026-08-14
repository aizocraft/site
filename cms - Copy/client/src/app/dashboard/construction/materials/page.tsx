'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Package2, Plus, Search, Trash2, Pencil, X, AlertTriangle, Boxes, Truck, Layers
} from 'lucide-react';
import { useMaterials, useSites, useSuppliers } from '@/lib/useConstructionData';
import { constructionApi, formatNaira, getStatusColor } from '@/lib/construction';

const categories = ['Concrete', 'Steel', 'Aggregate', 'Masonry', 'Plumbing', 'Electrical', 'Formwork', 'Roofing', 'Finishing', 'General'];
const units = ['Bags', 'Tonnes', 'Lengths', 'Metres', 'Sheets', 'Pieces', 'Units', 'Litres', 'Kg'];

const inputClass = 'w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function MaterialsPage() {
  const queryClient = useQueryClient();
  const [siteFilter, setSiteFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: materials, isLoading } = useMaterials({ site: siteFilter });
  const { data: sites = [] } = useSites();
  const { data: suppliers = [] } = useSuppliers();

  const filtered = useMemo(() => materials || [], [materials]);

  const stats = useMemo(() => {
    const all = materials || [];
    return {
      total: all.length,
      totalValue: all.reduce((s, m) => s + (m.totalValue || 0), 0),
      lowStock: all.filter(m => m.status !== 'in_stock').length,
      suppliers: suppliers.length,
    };
  }, [materials, suppliers]);

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (m: any) => { setEditing(m); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    try {
      await constructionApi.deleteMaterial(id);
      toast.success('Material deleted');
      queryClient.invalidateQueries({ queryKey: ['construction-materials'] });
      queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to delete material');
    }
  };

  const statCards = [
    { name: 'Total Materials', value: stats.total, icon: Package2, color: 'from-blue-500 to-indigo-600' },
    { name: 'Total Inventory Value', value: formatNaira(stats.totalValue), icon: Boxes, color: 'from-emerald-500 to-green-600' },
    { name: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, color: 'from-amber-500 to-orange-600' },
    { name: 'Suppliers', value: stats.suppliers, icon: Truck, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Package2 className="w-6 h-6 text-amber-600" /> Materials & Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track stock levels and procurement</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] self-start">
          <Plus className="w-4 h-4" /> Add Material
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Filter by Site:</span>
          <select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option value="all">All Sites</option>
            {sites.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        {stats.lowStock > 0 && (
          <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" /> {stats.lowStock} Low Stock
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4">Material</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Site</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-4 py-4">Reorder Level</th>
                <th className="px-4 py-4">Unit Cost</th>
                <th className="px-4 py-4">Total Value</th>
                <th className="px-4 py-4">Last Delivery</th>
                <th className="px-4 py-4">Supplier</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((m: any) => (
                <tr key={m._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{m.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{m.materialCode}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{m.category}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{m.siteName || '—'}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{m.stock} {m.unit}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{m.reorderLevel} {m.unit}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{formatNaira(m.unitCost)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatNaira(m.totalValue)}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{m.lastDelivery ? new Date(m.lastDelivery).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{m.supplier || '—'}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(m.status)}`}>{m.status.replace('_', ' ')}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(m._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No materials found</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <MaterialModal
          material={editing}
          sites={sites}
          suppliers={suppliers}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['construction-materials'] });
            queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
          }}
        />
      )}
    </div>
  );
}

function MaterialModal({ material, sites, suppliers, onClose, onSaved }: {
  material: any;
  sites: any[];
  suppliers: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: material?.name || '',
    category: material?.category || categories[0],
    site: material?.site || '',
    stock: material?.stock || '',
    unit: material?.unit || units[0],
    reorderLevel: material?.reorderLevel || '',
    unitCost: material?.unitCost || '',
    lastDelivery: material?.lastDelivery ? new Date(material.lastDelivery).toISOString().split('T')[0] : '',
    supplier: material?.supplier || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const selectedSite = sites.find((s: any) => s._id === form.site);
      const data = {
        ...form,
        stock: Number(form.stock) || 0,
        reorderLevel: Number(form.reorderLevel) || 0,
        unitCost: Number(form.unitCost) || 0,
        site: form.site || undefined,
        siteName: selectedSite?.name || undefined,
        lastDelivery: form.lastDelivery || undefined,
      };
      if (material?._id) {
        await constructionApi.updateMaterial(material._id, data);
        toast.success('Material updated');
      } else {
        await constructionApi.createMaterial(data);
        toast.success('Material added');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save material');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{material?._id ? 'Edit Material' : 'Add Material'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Material Name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Portland Cement (50kg bags)" /></Field>
            </div>
            <Field label="Category *">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Assign to Site">
              <select value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} className={inputClass}>
                <option value="">No assignment</option>
                {sites.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Stock Quantity *"><input required type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} placeholder="840" /></Field>
            <Field label="Unit">
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={inputClass}>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Reorder Level"><input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} className={inputClass} placeholder="200" /></Field>
            <Field label="Unit Cost (₦) *"><input required type="number" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} className={inputClass} placeholder="4200" /></Field>
            <Field label="Last Delivery Date"><input type="date" value={form.lastDelivery} onChange={(e) => setForm({ ...form, lastDelivery: e.target.value })} className={inputClass} /></Field>
            <Field label="Supplier">
              <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className={inputClass}>
                <option value="">Select supplier</option>
                {suppliers.map((s: any) => <option key={s._id} value={s.companyName}>{s.companyName}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium shadow-lg shadow-amber-500/30 hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : material?._id ? 'Update Material' : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
