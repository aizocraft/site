'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Building2, Banknote, FileText } from 'lucide-react';
import { useConstructionSettings } from '@/lib/useConstructionData';
import { constructionApi } from '@/lib/construction';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white';

export default function ConstructionSettingsPage() {
  const { data: settings, isLoading } = useConstructionSettings();
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        companyName: settings.companyName || '',
        slogan: settings.slogan || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || '',
        taxRate: settings.taxRate ?? 0.075,
        currency: settings.currency || 'KES',
        quotePrefix: settings.quotePrefix || 'BC-Q',
        invoicePrefix: settings.invoicePrefix || 'BC-INV',
        bankName: settings.bankName || '',
        accountName: settings.accountName || '',
        accountNumber: settings.accountNumber || '',
        tillNumber: settings.tillNumber || '',
        mpesaNumber: settings.mpesaNumber || '',
        notes: settings.notes || '',
        terms: settings.terms || '',
        signatureName: settings.signatureName || '',
      });
    }
  }, [settings]);

  const updateField = (key: string, value: string | number) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await constructionApi.saveSettings(form);
      toast.success('Engineer settings saved');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Engineer-specific branding and KSh payment defaults</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01]"
          disabled={saving}
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Business details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Company name</label>
              <input className={inputClass} value={form.companyName || ''} onChange={(e) => updateField('companyName', e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Slogan</label>
              <input className={inputClass} value={form.slogan || ''} onChange={(e) => updateField('slogan', e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <textarea rows={3} className={inputClass} value={form.address || ''} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input className={inputClass} value={form.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input className={inputClass} value={form.email || ''} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                <input className={inputClass} value={form.website || ''} onChange={(e) => updateField('website', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="mb-4 flex items-center gap-2">
            <Banknote className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Financial defaults</h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                <select className={inputClass} value={form.currency || 'KES'} onChange={(e) => updateField('currency', e.target.value)}>
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tax rate</label>
                <input type="number" step="0.01" className={inputClass} value={form.taxRate ?? 0} onChange={(e) => updateField('taxRate', Number(e.target.value))} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Quote prefix</label>
                <input className={inputClass} value={form.quotePrefix || ''} onChange={(e) => updateField('quotePrefix', e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice prefix</label>
                <input className={inputClass} value={form.invoicePrefix || ''} onChange={(e) => updateField('invoicePrefix', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Bank name</label>
              <input className={inputClass} value={form.bankName || ''} onChange={(e) => updateField('bankName', e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Account name</label>
                <input className={inputClass} value={form.accountName || ''} onChange={(e) => updateField('accountName', e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Account number</label>
                <input className={inputClass} value={form.accountNumber || ''} onChange={(e) => updateField('accountNumber', e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Till number</label>
                <input className={inputClass} value={form.tillNumber || ''} onChange={(e) => updateField('tillNumber', e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">M-Pesa number</label>
                <input className={inputClass} value={form.mpesaNumber || ''} onChange={(e) => updateField('mpesaNumber', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Terms and signature</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Terms</label>
            <textarea rows={4} className={inputClass} value={form.terms || ''} onChange={(e) => updateField('terms', e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea rows={4} className={inputClass} value={form.notes || ''} onChange={(e) => updateField('notes', e.target.value)} />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Signature name</label>
            <input className={inputClass} value={form.signatureName || ''} onChange={(e) => updateField('signatureName', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
