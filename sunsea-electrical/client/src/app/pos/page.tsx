'use client';

import { useMemo, useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, ReceiptText, Barcode, UserRound, Truck, Percent, Banknote, Sparkles, Phone, CheckCircle2, Printer, Download } from 'lucide-react';

const products = [
  { id: 1, name: 'Solar Panel 540W', category: 'Solar', price: 18500, stock: 24, image: '/images/solar.jpg' },
  { id: 2, name: '3kVA Inverter', category: 'Power', price: 76000, stock: 12, image: '/images/solar.jpg' },
  { id: 3, name: 'CCTV 4MP Kit', category: 'Security', price: 24950, stock: 18, image: '/cctv.jpg' },
  { id: 4, name: 'Distribution Board', category: 'Electrical', price: 32100, stock: 9, image: '/installation.jpg' },
  { id: 5, name: 'Generator 8kVA', category: 'Generator', price: 210000, stock: 5, image: '/generator.jpg' },
  { id: 6, name: 'Smart Home Kit', category: 'Automation', price: 49500, stock: 15, image: '/smart.jpg' },
  { id: 7, name: 'PVC Conduit Pack', category: 'Materials', price: 3800, stock: 42, image: '/services1.jpg' },
  { id: 8, name: 'Outdoor Floodlight', category: 'Lighting', price: 6200, stock: 27, image: '/installation.jpg' },
];

const initialOrder = [
  { id: 1, name: 'Solar Panel 540W', qty: 1, price: 18500 },
  { id: 3, name: 'CCTV 4MP Kit', qty: 1, price: 24950 },
];

const formatMoney = (value: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 2 }).format(value || 0);

export default function POSPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(initialOrder);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'card' | 'bank'>('mpesa');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [mpesaPhone, setMpesaPhone] = useState('254712345678');
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(16);
  const [receipt, setReceipt] = useState<{ number: string; customer: string; method: string; total: number; createdAt: string; items: { name: string; qty: number; price: number }[] } | null>(null);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => [product.name, product.category].join(' ').toLowerCase().includes(q));
  }, [query]);

  const addProduct = (product: (typeof products)[number]) => {
    setOrder((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...current, { id: product.id, name: product.name, qty: 1, price: product.price }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setOrder((current) => current
      .map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
      .filter((item) => item.qty > 0));
  };

  const removeItem = (id: number) => {
    setOrder((current) => current.filter((item) => item.id !== id));
  };

  const subtotal = order.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discountAmount = subtotal * (discount / 100);
  const taxAmount = (subtotal - discountAmount) * (taxPercent / 100);
  const total = subtotal - discountAmount + taxAmount;

  const handleCompleteSale = () => {
    const receiptNumber = `SS-${Date.now().toString().slice(-6)}`;
    setReceipt({
      number: receiptNumber,
      customer: customerName || 'Walk-in Customer',
      method: paymentMethod.toUpperCase(),
      total,
      createdAt: new Date().toLocaleString(),
      items: order.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
    });
  };

  const printReceipt = () => {
    if (!receipt) return;
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_80px_rgba(15,23,42,0.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              <Sparkles className="h-4 w-4" />
              SunSea POS
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Retail & Service Checkout</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <ReceiptText className="h-4 w-4" />
            POS Mode • Ready to sync
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products or categories..."
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none md:w-72"
                  />
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                  <Barcode className="h-4 w-4" />
                  Scan item
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <div className="mb-3 overflow-hidden rounded-2xl">
                      <img src={product.image} alt={product.name} className="h-28 w-full object-cover transition duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">{product.category}</div>
                        <div className="mt-1 text-base font-semibold text-slate-900">{product.name}</div>
                      </div>
                      <div className="rounded-xl bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm">{product.stock} left</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-900">{formatMoney(product.price)}</div>
                      <span className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white">
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Current order</div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Receipt</h2>
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>

            <div className="mb-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <UserRound className="h-4 w-4 text-slate-500" />
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  placeholder="Customer name"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Truck className="h-4 w-4 text-slate-500" />
                <div className="text-sm text-slate-600">Delivery or pickup</div>
              </div>
            </div>

            <div className="space-y-3">
              {order.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No products added yet.
                </div>
              ) : (
                order.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{formatMoney(item.price)} each</div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1">
                        <button onClick={() => updateQty(item.id, -1)} className="rounded-lg p-1.5 hover:bg-slate-100"><Minus className="h-4 w-4" /></button>
                        <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="rounded-lg p-1.5 hover:bg-slate-100"><Plus className="h-4 w-4" /></button>
                      </div>
                      <div className="text-base font-bold text-slate-900">{formatMoney(item.qty * item.price)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Percent className="h-4 w-4 text-slate-500" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none"
                />
                <span className="text-sm text-slate-500">%</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Discount</span>
                <span className="font-medium text-slate-900">-{formatMoney(discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tax ({taxPercent}%)</span>
                <span className="font-medium text-slate-900">{formatMoney(taxAmount)}</span>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center justify-between text-sm text-emerald-700">
                  <span>Total</span>
                  <span className="text-2xl font-bold text-emerald-800">{formatMoney(total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Payment method</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'cash', label: 'Cash', icon: Banknote },
                  { key: 'mpesa', label: 'M-Pesa', icon: CreditCard },
                  { key: 'card', label: 'Card', icon: CreditCard },
                  { key: 'bank', label: 'Bank', icon: ReceiptText },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key as any)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      paymentMethod === key ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'mpesa' && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <Phone className="h-4 w-4" />
                  M-Pesa payment prompt
                </div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Customer phone</label>
                <input
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="2547xxxxxxxx"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
                />
                <div className="mt-3 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-xs text-emerald-800">
                  <span>Prompt amount</span>
                  <span className="font-bold">{formatMoney(total)}</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                Hold
              </button>
              <button
                onClick={handleCompleteSale}
                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Complete Sale
              </button>
            </div>

            {receipt && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Receipt</div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{receipt.number}</h3>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Paid
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between"><span>Customer</span><span className="font-medium text-slate-900">{receipt.customer}</span></div>
                  <div className="flex justify-between"><span>Method</span><span className="font-medium text-slate-900">{receipt.method}</span></div>
                  <div className="flex justify-between"><span>Time</span><span className="font-medium text-slate-900">{receipt.createdAt}</span></div>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">
                  {receipt.items.map((item) => (
                    <div key={`${receipt.number}-${item.name}`} className="flex justify-between gap-3 text-sm">
                      <span className="text-slate-600">{item.qty}x {item.name}</span>
                      <span className="font-medium text-slate-900">{formatMoney(item.qty * item.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatMoney(receipt.total)}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={printReceipt} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
                    <Printer className="h-4 w-4" />
                    Print
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                    <Download className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
