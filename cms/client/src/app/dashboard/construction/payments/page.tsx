'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Wallet, Plus, Search, Trash2, X, CheckCircle2, Clock, XCircle, Filter, Eye
} from 'lucide-react';
import { usePayments, useWorkers, useEngineers, useSuppliers } from '@/lib/useConstructionData';
import { constructionApi, formatCurrency, getStatusColor, getInitials } from '@/lib/construction';

const inputClass = 'w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: payments, isLoading } = usePayments({ status });
  const { data: workers = [] } = useWorkers();
  const { data: engineers = [] } = useEngineers();
  const { data: suppliers = [] } = useSuppliers();

  const filtered = useMemo(() => payments || [], [payments]);

  const summary = useMemo(() => {
    const all = payments || [];
    return {
      paid: all.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
      pending: all.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
      overdue: all.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0),
      total: all.length,
      paidCount: all.filter(p => p.status === 'paid').length,
      pendingCount: all.filter(p => p.status === 'pending').length,
      overdueCount: all.filter(p => p.status === 'overdue').length,
    };
  }, [payments]);

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (p: any) => { setEditing(p); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment?')) return;
    try {
      await constructionApi.deletePayment(id);
      toast.success('Payment deleted');
      queryClient.invalidateQueries({ queryKey: ['construction-payments'] });
      queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to delete payment');
    }
  };

  const handleStatusChange = async (p: any, newStatus: 'paid' | 'pending' | 'overdue') => {
    try {
      await constructionApi.updatePayment(p._id, { status: newStatus });
      toast.success(`Payment marked ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['construction-payments'] });
      queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
      queryClient.invalidateQueries({ queryKey: ['construction-workers'] });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to update payment');
    }
  };

  const summaryCards = [
    { name: 'Paid', value: formatCurrency(summary.paid), count: summary.paidCount, icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
    { name: 'Pending', value: formatCurrency(summary.pending), count: summary.pendingCount, icon: Clock, color: 'from-amber-500 to-orange-600' },
    { name: 'Overdue', value: formatCurrency(summary.overdue), count: summary.overdueCount, icon: XCircle, color: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><Wallet className="w-6 h-6 text-purple-600" /> Payments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Worker, engineer, and supplier payments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] self-start">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.name}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.count} payments</p>
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
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
        <span className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} payments</span>
      </div>

      {isLoading ? (
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4">Recipient</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Site</th>
                <th className="px-4 py-4">Period</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((p: any) => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {getInitials(p.recipientName.split(' ')[0] || 'P', p.recipientName.split(' ')[1] || '')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{p.recipientName}</p>
                        <p className="text-xs text-gray-400 font-mono">{p.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 capitalize">{p.recipientType}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{p.siteName || '—'}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {p.periodStart ? new Date(p.periodStart).toLocaleDateString() : '—'} – {p.periodEnd ? new Date(p.periodEnd).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-4">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p, e.target.value as 'paid' | 'pending' | 'overdue')}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(p.status)}`}
                    >
                      <option value="paid">paid</option>
                      <option value="pending">pending</option>
                      <option value="overdue">overdue</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Wallet className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No payments found</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <PaymentModal
          payment={editing}
          workers={workers}
          engineers={engineers}
          suppliers={suppliers}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['construction-payments'] });
            queryClient.invalidateQueries({ queryKey: ['construction-overview'] });
            queryClient.invalidateQueries({ queryKey: ['construction-workers'] });
          }}
        />
      )}
    </div>
  );
}

function PaymentModal({ payment, workers, engineers, suppliers, onClose, onSaved }: {
  payment: any;
  workers: any[];
  engineers: any[];
  suppliers: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [recipientType, setRecipientType] = useState(payment?.recipientType || 'worker');
  const [form, setForm] = useState({
    recipient: payment?.recipient || '',
    amount: payment?.amount || '',
    status: payment?.status || 'pending',
    paymentMethod: payment?.paymentMethod || 'Cash',
    periodStart: payment?.periodStart ? new Date(payment.periodStart).toISOString().split('T')[0] : '',
    periodEnd: payment?.periodEnd ? new Date(payment.periodEnd).toISOString().split('T')[0] : '',
    notes: payment?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const recipients = recipientType === 'worker' ? workers : recipientType === 'engineer' ? engineers : suppliers;
  const recipientName = () => {
    const r = recipients.find((x: any) => x._id === form.recipient);
    if (!r) return '';
    if (recipientType === 'supplier') return r.companyName;
    return `${r.firstName || ''} ${r.lastName || ''}`.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = recipients.find((x: any) => x._id === form.recipient);
      const data = {
        ...form,
        recipientType,
        amount: Number(form.amount) || 0,
        recipient: form.recipient || undefined,
        recipientName: recipientName(),
        site: r?.site || r?.assignedSite,
        siteName: r?.siteName || r?.assignedSiteName,
        periodStart: form.periodStart || undefined,
        periodEnd: form.periodEnd || undefined,
      };
      if (payment?._id) {
        await constructionApi.updatePayment(payment._id, data);
        toast.success('Payment updated');
      } else {
        await constructionApi.createPayment(data);
        toast.success('Payment recorded');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save payment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{payment?._id ? 'Edit Payment' : 'Record Payment'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field label="Recipient Type">
            <select value={recipientType} onChange={(e) => { setRecipientType(e.target.value); setForm({ ...form, recipient: '' }); }} className={inputClass}>
              <option value="worker">Worker</option>
              <option value="engineer">Engineer</option>
              <option value="supplier">Supplier</option>
            </select>
          </Field>
          <Field label="Recipient *">
            <select required value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} className={inputClass}>
              <option value="">Select {recipientType}...</option>
              {recipients.map((x: any) => (
                <option key={x._id} value={x._id}>
                  {recipientType === 'supplier' ? x.companyName : `${x.firstName} ${x.lastName}`}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Amount *"><input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} placeholder="234000" /></Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </Field>
            <Field label="Payment Method">
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className={inputClass}>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Cheque">Cheque</option>
              </select>
            </Field>
            <Field label="Period Start (optional)"><input type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} className={inputClass} /></Field>
            <Field label="Period End (optional)"><input type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} className={inputClass} /></Field>
            <div className="sm:col-span-2">
              <Field label="Notes"><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} rows={2} /></Field>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium shadow-lg shadow-purple-500/30 hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : payment?._id ? 'Update Payment' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}