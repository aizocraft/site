'use client';

import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { FileText, Search, Download, PencilLine, Plus, Trash2, Save, X } from 'lucide-react';
import { constructionApi, ConstructionQuote } from '@/lib/construction';
import { useConstructionSettings, useQuotes } from '@/lib/useConstructionData';

const getCurrencyFormatter = (currency = 'KES') => new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency,
  maximumFractionDigits: 2,
});

const emptyItem = () => ({
  name: '',
  description: '',
  qty: 1,
  unit: 'pcs',
  price: 0,
  total: 0,
});

const createEmptyForm = (type: 'quotation' | 'invoice') => ({
  type,
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  siteName: '',
  status: 'draft',
  terms: 'Payment due within 30 days of invoice date.',
  notes: '',
  taxRate: 0.075,
  discount: 0,
  discountType: 'percentage',
  transport: 0,
  items: [emptyItem()],
});

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const getDocValue = (quote: ConstructionQuote, key: keyof ConstructionQuote) =>
  (quote as any)?.[key] ?? '';

export default function ConstructionQuotesPage() {
  const [type, setType] = useState<'quotation' | 'invoice'>('quotation');
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(createEmptyForm('quotation'));
  const { data: settings } = useConstructionSettings();
  const { data = [], isLoading, refetch } = useQuotes({ type });
  const currencyCode = settings?.currency || 'KES';
  const formatCurrency = (value: number) => getCurrencyFormatter(currencyCode).format(value || 0);

  const filtered = useMemo(() => {
    const text = search.toLowerCase();
    return (data || []).filter((quote: ConstructionQuote) => {
      if (!text) return true;
      return [quote.docNumber, quote.clientName, quote.siteName || '', quote.notes || '']
        .join(' ')
        .toLowerCase()
        .includes(text);
    });
  }, [data, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(createEmptyForm(type));
    setEditorOpen(true);
  };

  const openEdit = (quote: ConstructionQuote) => {
    setEditingId(quote._id);
    setForm({
      type: quote.type || type,
      clientName: quote.clientName || '',
      clientPhone: quote.clientPhone || '',
      clientEmail: quote.clientEmail || '',
      clientAddress: quote.clientAddress || '',
      siteName: quote.siteName || '',
      status: quote.status || 'draft',
      notes: quote.notes || '',
      terms: quote.terms || 'Payment due within 30 days of invoice date.',
      taxRate: quote.taxRate || 0.075,
      discount: quote.discount || 0,
      discountType: quote.discountType || 'percentage',
      transport: quote.transport || 0,
      items: (quote.items || []).map((item: any) => ({
        name: item.name || '',
        description: item.description || '',
        qty: item.qty || 1,
        unit: item.unit || 'pcs',
        price: item.price || 0,
        total: (item.qty || 1) * (item.price || 0),
      })),
    });
    setEditorOpen(true);
  };

  const handleInput = (field: string, value: string | number) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setForm((prev: any) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]: value,
      };
      if (field === 'qty' || field === 'price') {
        items[index].total = Number(items[index].qty || 0) * Number(items[index].price || 0);
      }
      return { ...prev, items };
    });
  };

  const addItem = () => setForm((prev: any) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  const removeItem = (index: number) => setForm((prev: any) => ({ ...prev, items: prev.items.filter((_: any, i: number) => i !== index) }));

  const calculateTotals = (doc: any) => {
    const subtotal = (doc.items || []).reduce((sum: number, item: any) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);
    const discount = doc.discountType === 'percentage' ? subtotal * (Number(doc.discount || 0) / 100) : Number(doc.discount || 0);
    const tax = (subtotal - discount) * Number(doc.taxRate || 0.075);
    const total = subtotal - discount + tax + Number(doc.transport || 0);
    return { subtotal, discount, tax, total };
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...form,
        type,
        items: form.items.filter((item: any) => item.name || item.description).map((item: any) => ({
          ...item,
          qty: Number(item.qty || 0),
          price: Number(item.price || 0),
          total: Number(item.qty || 0) * Number(item.price || 0),
        })),
      };
      const totals = calculateTotals(payload);
      payload.subtotal = totals.subtotal;
      payload.tax = totals.tax;
      payload.total = totals.total;
      payload.balanceDue = totals.total;
      if (editingId) {
        await constructionApi.updateQuote(editingId, payload);
        toast.success('Document updated');
      } else {
        await constructionApi.createQuote(payload);
        toast.success('Document created');
      }
      setEditorOpen(false);
      setForm(createEmptyForm(type));
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Unable to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await constructionApi.deleteQuote(id);
      toast.success('Document deleted');
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to delete document');
    }
  };

  const exportDocument = async (record: ConstructionQuote, format: 'pdf' | 'csv' | 'doc') => {
    const safeItems = (record.items || []).map((item: any) => ({
      name: item.name || 'Item',
      description: item.description || '',
      qty: item.qty || 1,
      unit: item.unit || 'pcs',
      price: item.price || 0,
      total: Number(item.qty || 0) * Number(item.price || 0),
    }));

    if (format === 'csv') {
      const csvRows = [
        ['Document', record.docNumber || ''],
        ['Type', record.type || 'quotation'],
        ['Client', record.clientName || ''],
        ['Phone', record.clientPhone || ''],
        ['Email', record.clientEmail || ''],
        ['Site', record.siteName || ''],
        [''],
        ['Item', 'Description', 'Qty', 'Unit', 'Price', 'Total'],
        ...safeItems.map((item) => [item.name, item.description, String(item.qty), item.unit, String(item.price), String(item.total)]),
        [''],
        ['Subtotal', String(record.subtotal || 0)],
        ['Tax', String(record.tax || 0)],
        ['Transport', String(record.transport || 0)],
        ['Total', String(record.total || 0)],
      ];
      const csv = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${record.docNumber || 'document'}.csv`);
      return;
    }

    if (format === 'doc') {
      const html = `
        <html><body>
          <h1>${record.type === 'invoice' ? 'Invoice' : 'Quotation'}: ${record.docNumber || ''}</h1>
          <p><strong>Client:</strong> ${record.clientName || ''}</p>
          <p><strong>Phone:</strong> ${record.clientPhone || ''}</p>
          <p><strong>Email:</strong> ${record.clientEmail || ''}</p>
          <table border="1" cellpadding="6" cellspacing="0">
            <tr><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Price</th><th>Total</th></tr>
            ${safeItems.map((item) => `<tr><td>${item.name}</td><td>${item.description}</td><td>${item.qty}</td><td>${item.unit}</td><td>${item.price}</td><td>${item.total}</td></tr>`).join('')}
          </table>
          <p><strong>Subtotal:</strong> ${currencyCode} ${record.subtotal || 0}</p>
          <p><strong>Total:</strong> ${currencyCode} ${record.total || 0}</p>
        </body></html>
      `;
      downloadBlob(new Blob([html], { type: 'application/msword' }), `${record.docNumber || 'document'}.doc`);
      return;
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 60;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(record.type === 'invoice' ? 'INVOICE' : 'QUOTATION', pageWidth / 2, y, { align: 'center' });
    y += 24;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Document #: ${record.docNumber || ''}`, 48, y);
    y += 18;
    doc.text(`Client: ${record.clientName || ''}`, 48, y);
    y += 16;
    doc.text(`Phone: ${record.clientPhone || ''}`, 48, y);
    y += 16;
    doc.text(`Email: ${record.clientEmail || ''}`, 48, y);
    y += 24;

    doc.setFont('helvetica', 'bold');
    doc.text('Item', 48, y);
    doc.text('Qty', 250, y);
    doc.text('Price', 330, y);
    doc.text('Total', 430, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    safeItems.forEach((item) => {
      doc.text(item.name || 'Item', 48, y, { maxWidth: 170 });
      doc.text(String(item.qty || 0), 250, y);
      doc.text(`KES ${Number(item.price || 0).toLocaleString()}`, 330, y);
      doc.text(`KES ${(Number(item.qty || 0) * Number(item.price || 0)).toLocaleString()}`, 430, y);
      y += 18;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
doc.text(`Subtotal: ${currencyCode} ${(record.subtotal || 0).toLocaleString()}`, 390, y);
    y += 18;
    doc.text(`Tax: ${currencyCode} ${(record.tax || 0).toLocaleString()}`, 390, y);
    y += 18;
    doc.text(`Transport: ${currencyCode} ${(record.transport || 0).toLocaleString()}`, 390, y);
    y += 18;
    doc.text(`Total: ${currencyCode} ${(record.total || 0).toLocaleString()}`, 390, y);

    doc.save(`${record.docNumber || 'document'}.pdf`);
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotes & Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage construction documents with premium control and export tools</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {(['quotation', 'invoice'] as const).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setType(item);
                  setForm(createEmptyForm(item));
                }}
                className={`px-3 py-2 text-sm font-medium transition ${
                  type === item ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {item === 'quotation' ? 'Quotations' : 'Invoices'}
              </button>
            ))}
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            New {type === 'quotation' ? 'Quotation' : 'Invoice'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents or clients..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Document</th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Client</th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Total</th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                    No {type === 'quotation' ? 'quotations' : 'invoices'} found.
                  </td>
                </tr>
              ) : (
                filtered.map((quote: ConstructionQuote) => (
                  <tr key={quote._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{quote.docNumber}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{quote.siteName || 'No site'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{quote.clientName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{quote.clientPhone || 'No phone'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatCurrency(quote.total || 0)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-1 dark:border-gray-700">
                          <button onClick={() => exportDocument(quote, 'pdf')} title="Download PDF" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"> <Download className="h-4 w-4" /> </button>
                          <button onClick={() => exportDocument(quote, 'csv')} title="Export CSV" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">CSV</button>
                          <button onClick={() => exportDocument(quote, 'doc')} title="Export Word" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">DOC</button>
                        </div>
                        <button onClick={() => openEdit(quote)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-slate-300 dark:hover:bg-slate-800">
                          <PencilLine className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(quote._id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-950">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{editingId ? 'Edit' : 'Create'} {type}</p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Update document' : 'New document'}</h2>
              </div>
              <button onClick={() => setEditorOpen(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Client name</label>
                  <input value={getDocValue(form, 'clientName')} onChange={(e) => handleInput('clientName', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Client phone</label>
                  <input value={getDocValue(form, 'clientPhone')} onChange={(e) => handleInput('clientPhone', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Client email</label>
                  <input value={getDocValue(form, 'clientEmail')} onChange={(e) => handleInput('clientEmail', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Site</label>
                  <input value={getDocValue(form, 'siteName')} onChange={(e) => handleInput('siteName', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select value={form.status} onChange={(e) => handleInput('status', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="paid">Paid</option>
                    <option value="partially_paid">Partially paid</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Client address</label>
                  <input value={getDocValue(form, 'clientAddress')} onChange={(e) => handleInput('clientAddress', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Scope of work</h3>
                  <button onClick={addItem} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:text-slate-200 dark:hover:bg-gray-800">
                    <Plus className="h-3.5 w-3.5" />
                    Add item
                  </button>
                </div>

                <div className="space-y-4">
                  {(form.items || []).map((item: any, index: number) => (
                    <div key={index} className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Item {index + 1}</span>
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(index)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">Item name</label>
                          <input value={item.name || ''} onChange={(e) => updateItem(index, 'name', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">Description of work</label>
                          <textarea rows={3} value={item.description || ''} onChange={(e) => updateItem(index, 'description', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">Qty</label>
                          <input type="number" min={0} value={item.qty || 0} onChange={(e) => updateItem(index, 'qty', Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">Unit</label>
                          <input value={item.unit || 'pcs'} onChange={(e) => updateItem(index, 'unit', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">Unit price</label>
                          <input type="number" min={0} value={item.price || 0} onChange={(e) => updateItem(index, 'price', Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">Line total</label>
                          <input value={Number(item.qty || 0) * Number(item.price || 0)} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tax rate</label>
                  <input type="number" step="0.01" value={form.taxRate || 0} onChange={(e) => handleInput('taxRate', Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Transport</label>
                  <input type="number" step="0.01" value={form.transport || 0} onChange={(e) => handleInput('transport', Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Discount type</label>
                  <select value={form.discountType || 'percentage'} onChange={(e) => handleInput('discountType', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Discount</label>
                  <input type="number" step="0.01" value={form.discount || 0} onChange={(e) => handleInput('discount', Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                  <textarea rows={3} value={form.notes || ''} onChange={(e) => handleInput('notes', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Terms</label>
                  <textarea rows={3} value={form.terms || ''} onChange={(e) => handleInput('terms', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-800 dark:bg-slate-900/30">
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Subtotal</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculateTotals(form).subtotal)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Discount</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculateTotals(form).discount)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Tax</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculateTotals(form).tax)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(calculateTotals(form).total)}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                <button onClick={() => setEditorOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save document'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
