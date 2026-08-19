'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, logout as logoutApi, useAuth } from '@/lib/auth';
import { constructionApi, formatCurrency, getStatusColor, getProgressColor } from '@/lib/construction';
import toast from 'react-hot-toast';

// ============ TYPES ============
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'sales' | 'user';
  isActive: boolean;
  avatar?: string;
}

interface Site {
  _id: string;
  siteCode: string;
  name: string;
  type: string;
  location: string;
  status: string;
  progress: number;
  engineer?: string;
  engineerName?: string;
  workerCount: number;
  budget: { total: number; spent: number; remaining: number };
  clientName?: string;
  clientPhone?: string;
  startDate?: string;
  expectedEndDate?: string;
  description?: string;
  createdAt: string;
}

interface Engineer {
  _id: string;
  engineerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  experienceYears: number;
  licenseNo?: string;
  assignedSite?: string;
  assignedSiteName?: string;
  monthlySalary: number;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
}

interface Worker {
  _id: string;
  workerCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  site?: string;
  siteName?: string;
  dailyRate: number;
  attendanceRate: number;
  totalEarned: number;
  daysWorked: number;
  status: 'active' | 'inactive';
  joinedDate?: string;
  createdAt: string;
}

interface Material {
  _id: string;
  materialCode: string;
  name: string;
  category: string;
  site?: string;
  siteName?: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
}

interface Payment {
  _id: string;
  reference: string;
  recipientType: 'worker' | 'engineer' | 'supplier';
  recipient?: string;
  recipientName: string;
  site?: string;
  siteName?: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

interface Attendance {
  _id: string;
  worker: string;
  workerName: string;
  site?: string;
  siteName?: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'late' | 'overtime';
  hoursWorked: number;
  createdAt: string;
}

interface Supplier {
  _id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface DashboardStats {
  activeSites: number;
  totalSites: number;
  activeWorkers: number;
  totalWorkers: number;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  pendingAmount: number;
  overdueAmount: number;
  pendingPayments: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  totalEngineers: number;
  totalMaterials: number;
  lowStock: number;
  totalInventoryValue: number;
  totalSuppliers: number;
}

interface EngineerSettings {
  _id?: string;
  companyName: string;
  slogan: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxRate: number;
  currency: string;
  quotePrefix: string;
  invoicePrefix: string;
  terms: string;
  notes: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  tillNumber: string;
  mpesaNumber: string;
  signatureName: string;
}

interface QuoteItem {
  name: string;
  description?: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
}

interface Quote {
  _id: string;
  docNumber: string;
  type: 'quotation' | 'invoice';
  engineer: string;
  ownedBy: string;
  site?: string;
  siteName?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  transport: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  amountPaid: number;
  balanceDue: number;
  issueDate: string;
  dueDate?: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ EXTENDED API FUNCTIONS ============
// Add missing functions to constructionApi
const extendedConstructionApi = {
  ...constructionApi,

  // Quotes
  getQuotes: async (params?: { type?: string }): Promise<Quote[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/construction/quotes?${new URLSearchParams(params as any).toString()}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch quotes');
    const data = await response.json();
    return data.quotes || [];
  },

  createQuote: async (data: Partial<Quote>): Promise<Quote> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/construction/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create quote');
    const result = await response.json();
    return result.quote;
  },

  updateQuote: async (id: string, data: Partial<Quote>): Promise<Quote> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/construction/quotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update quote');
    const result = await response.json();
    return result.quote;
  },

  deleteQuote: async (id: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/construction/quotes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete quote');
  },

  // Settings
  getSettings: async (): Promise<EngineerSettings | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/construction/settings`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.settings || null;
    } catch {
      return null;
    }
  },

  saveSettings: async (data: Partial<EngineerSettings>): Promise<EngineerSettings> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/construction/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save settings');
    const result = await response.json();
    return result.settings;
  },
};

// ============ MAIN COMPONENT ============
export default function ConstructionPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sites' | 'engineers' | 'workers' | 'materials' | 'payments' | 'attendance' | 'suppliers' | 'quotes' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [settings, setSettings] = useState<EngineerSettings | null>(null);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'site' | 'engineer' | 'worker' | 'material' | 'payment' | 'attendance' | 'supplier' | 'quote' | 'settings'>('site');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const isAdmin = user?.role === 'admin';
  const isEngineer = user?.role === 'engineer';

  // ============ CHECK AUTH ============
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
  }, [isLoggedIn, router]);

// ============ FETCH DATA ============
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const [overviewData, sitesData, engineersData, workersData, materialsData, paymentsData, suppliersData, quotesData, settingsData] = await Promise.all([
      constructionApi.getOverview().catch(() => null),
      constructionApi.getSites().catch(() => []),
      constructionApi.getEngineers().catch(() => []),
      constructionApi.getWorkers().catch(() => []),
      constructionApi.getMaterials().catch(() => []),
      constructionApi.getPayments().catch(() => []),
      constructionApi.getSuppliers().catch(() => []),
      extendedConstructionApi.getQuotes().catch(() => []),
      extendedConstructionApi.getSettings().catch(() => null),
    ]);

    if (overviewData) {
      setStats(overviewData.stats);
    }
    setSites(sitesData as Site[]);
    setEngineers(engineersData as Engineer[]);
    setWorkers(workersData as Worker[]);
    setMaterials(materialsData as Material[]);
    setPayments(paymentsData as Payment[]);
    setSuppliers(suppliersData as Supplier[]);
    setQuotes(quotesData as Quote[]);
    setSettings(settingsData as EngineerSettings | null);

    if (isEngineer) {
      const attendanceData = await constructionApi.getAttendance().catch(() => []);
      setAttendance(attendanceData as Attendance[]);
    }
  } catch (error: any) {
    console.error('Failed to fetch data:', error);
    toast.error(error.response?.data?.error || 'Failed to load data');
  } finally {
    setLoading(false);
  }
}, [router, isEngineer]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  // ============ MODAL HANDLERS ============
  const openModal = (type: any, data?: any) => {
    setModalType(type);
    setEditingId(data?._id || null);
    setFormData(data || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({});
    fetchData();
  };

  // ============ CRUD OPERATIONS ============
  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await constructionApi.createSite(formData);
      toast.success('Site created successfully');
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create site');
    }
  };

  const handleCreateEngineer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, createUserAccount: true };
      await constructionApi.createEngineer(data);
      toast.success('Engineer created with user account');
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create engineer');
    }
  };

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await constructionApi.createWorker(formData);
      toast.success('Worker created successfully');
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create worker');
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await constructionApi.createMaterial(formData);
      toast.success('Material added successfully');
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add material');
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await constructionApi.createPayment(formData);
      toast.success('Payment recorded successfully');
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to record payment');
    }
  };

  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await constructionApi.createAttendance(formData);
      toast.success('Attendance recorded successfully');
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to record attendance');
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await constructionApi.createSupplier(formData);
      toast.success('Supplier added successfully');
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add supplier');
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const quoteData = {
        ...formData,
        type: formData.type || 'quotation',
        items: formData.items || [],
        clientName: formData.clientName || '',
      };
      await extendedConstructionApi.createQuote(quoteData);
      toast.success(`${formData.type || 'Quote'} created successfully`);
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create quote');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await extendedConstructionApi.saveSettings(formData);
      toast.success('Settings saved successfully');
      setSettings(formData);
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save settings');
    }
  };

// ============ UPDATE QUOTE STATUS ============
const handleUpdateQuoteStatus = async (id: string, status: string) => {
  try {
    // Cast status to the expected type
    const validStatus = status as 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
    await extendedConstructionApi.updateQuote(id, { status: validStatus });
    toast.success('Status updated');
    fetchData();
  } catch (error: any) {
    toast.error(error.response?.data?.error || 'Failed to update status');
  }
};

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
      const deleteMap: Record<string, (id: string) => Promise<void>> = {
        site: constructionApi.deleteSite,
        engineer: constructionApi.deleteEngineer,
        worker: constructionApi.deleteWorker,
        material: constructionApi.deleteMaterial,
        payment: constructionApi.deletePayment,
        supplier: constructionApi.deleteSupplier,
        quote: extendedConstructionApi.deleteQuote,
      };
      await deleteMap[type](id);
      toast.success(`${type} deleted successfully`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || `Failed to delete ${type}`);
    }
  };

  // ============ CHANGE PASSWORD ============
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (!response.ok) throw new Error('Failed to change password');
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  // ============ LOGOUT ============
  const handleLogout = async () => {
    await logoutApi();
    router.push('/auth/login');
  };

  // ============ FILTERING ============
  const filteredSites = sites.filter((s: Site) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.siteCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredWorkers = workers.filter((w: Worker) => {
    const matchSearch = w.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        w.workerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 h-28"></div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Construction Management</h1>
            <span className="text-sm text-gray-500 capitalize">({user?.role})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm hidden sm:inline">{user?.name || user?.email}</span>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <StatCard label="Active Sites" value={stats.activeSites} total={stats.totalSites} color="blue" />
            <StatCard label="Active Workers" value={stats.activeWorkers} total={stats.totalWorkers} color="emerald" />
            <StatCard label="Engineers" value={stats.totalEngineers} color="purple" />
            <StatCard label="Materials" value={stats.totalMaterials} subtext={`${stats.lowStock} low stock`} color="amber" />
            <StatCard label="Budget Remaining" value={formatCurrency(stats.remainingBudget)} color="green" />
            <StatCard label="Pending Payments" value={formatCurrency(stats.pendingAmount)} subtext={`${stats.pendingCount} pending`} color="red" />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="flex flex-wrap border-b overflow-x-auto">
            {['overview', 'sites', 'engineers', 'workers', 'materials', 'payments', 'attendance', 'suppliers', 'quotes', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'quotes' ? '📄 Quotes & Invoices' : tab === 'settings' ? '⚙️ Settings' : tab}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewTab
                stats={stats}
                sites={sites.slice(0, 5)}
                payments={payments.slice(0, 5)}
                isAdmin={isAdmin}
                isEngineer={isEngineer}
                onAdd={() => openModal('site')}
              />
            )}

            {/* Sites Tab */}
            {activeTab === 'sites' && (
              <SitesTab
                sites={filteredSites}
                isAdmin={isAdmin}
                isEngineer={isEngineer}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onAdd={() => openModal('site')}
                onEdit={(site: Site) => openModal('site', site)}
                onDelete={(id: string) => handleDelete('site', id)}
              />
            )}

            {/* Engineers Tab */}
            {activeTab === 'engineers' && (
              <EngineersTab
                engineers={engineers}
                isAdmin={isAdmin}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAdd={() => openModal('engineer')}
                onEdit={(eng: Engineer) => openModal('engineer', eng)}
                onDelete={(id: string) => handleDelete('engineer', id)}
              />
            )}

            {/* Workers Tab */}
            {activeTab === 'workers' && (
              <WorkersTab
                workers={filteredWorkers}
                isAdmin={isAdmin}
                isEngineer={isEngineer}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onAdd={() => openModal('worker')}
                onEdit={(w: Worker) => openModal('worker', w)}
                onDelete={(id: string) => handleDelete('worker', id)}
              />
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <MaterialsTab
                materials={materials}
                isAdmin={isAdmin}
                isEngineer={isEngineer}
                onAdd={() => openModal('material')}
                onEdit={(m: Material) => openModal('material', m)}
                onDelete={(id: string) => handleDelete('material', id)}
              />
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <PaymentsTab
                payments={payments}
                isAdmin={isAdmin}
                isEngineer={isEngineer}
                onAdd={() => openModal('payment')}
                onDelete={(id: string) => handleDelete('payment', id)}
              />
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <AttendanceTab
                attendance={attendance}
                workers={workers}
                isEngineer={isEngineer}
                onAdd={() => openModal('attendance')}
              />
            )}

            {/* Suppliers Tab */}
            {activeTab === 'suppliers' && (
              <SuppliersTab
                suppliers={suppliers}
                isAdmin={isAdmin}
                onAdd={() => openModal('supplier')}
                onEdit={(s: Supplier) => openModal('supplier', s)}
                onDelete={(id: string) => handleDelete('supplier', id)}
              />
            )}

            {/* Quotes & Invoices Tab */}
            {activeTab === 'quotes' && (
              <QuotesTab
                quotes={quotes}
                isAdmin={isAdmin}
                isEngineer={isEngineer}
                settings={settings}
                onAdd={() => openModal('quote')}
                onEdit={(q: Quote) => openModal('quote', q)}
                onDelete={(id: string) => handleDelete('quote', id)}
                onUpdateStatus={handleUpdateQuoteStatus}
                formatCurrency={formatCurrency}
              />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <SettingsTab
                settings={settings}
                isAdmin={isAdmin}
                isEngineer={isEngineer}
                onEdit={() => openModal('settings', settings || {})}
              />
            )}
          </div>
        </div>
      </main>

      {/* ============ MODALS ============ */}
      {showModal && (
        <Modal
          title={
            modalType === 'site' ? `${editingId ? 'Edit' : 'New'} Site` :
            modalType === 'engineer' ? `${editingId ? 'Edit' : 'New'} Engineer` :
            modalType === 'worker' ? `${editingId ? 'Edit' : 'New'} Worker` :
            modalType === 'material' ? `${editingId ? 'Edit' : 'New'} Material` :
            modalType === 'payment' ? 'Record Payment' :
            modalType === 'attendance' ? 'Record Attendance' :
            modalType === 'supplier' ? `${editingId ? 'Edit' : 'New'} Supplier` :
            modalType === 'quote' ? `${editingId ? 'Edit' : 'New'} ${formData.type === 'invoice' ? 'Invoice' : 'Quotation'}` :
            'Company Settings'
          }
          onClose={closeModal}
        >
          {modalType === 'site' && (
            <SiteForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreateSite}
              onCancel={closeModal}
              engineers={engineers}
              isEdit={!!editingId}
            />
          )}
          {modalType === 'engineer' && (
            <EngineerForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreateEngineer}
              onCancel={closeModal}
              isEdit={!!editingId}
            />
          )}
          {modalType === 'worker' && (
            <WorkerForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreateWorker}
              onCancel={closeModal}
              sites={sites}
              isEdit={!!editingId}
            />
          )}
          {modalType === 'material' && (
            <MaterialForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreateMaterial}
              onCancel={closeModal}
              sites={sites}
              isEdit={!!editingId}
            />
          )}
          {modalType === 'payment' && (
            <PaymentForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreatePayment}
              onCancel={closeModal}
              workers={workers}
              engineers={engineers}
            />
          )}
          {modalType === 'attendance' && (
            <AttendanceForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreateAttendance}
              onCancel={closeModal}
              workers={workers}
            />
          )}
          {modalType === 'supplier' && (
            <SupplierForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreateSupplier}
              onCancel={closeModal}
              isEdit={!!editingId}
            />
          )}
          {modalType === 'quote' && (
            <QuoteForm
              data={formData}
              setData={setFormData}
              onSubmit={handleCreateQuote}
              onCancel={closeModal}
              sites={sites}
              settings={settings}
              isEdit={!!editingId}
              formatCurrency={formatCurrency}
            />
          )}
          {modalType === 'settings' && (
            <SettingsForm
              data={formData}
              setData={setFormData}
              onSubmit={handleSaveSettings}
              onCancel={closeModal}
              isEdit={!!editingId}
            />
          )}
        </Modal>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <Modal title="Change Password" onClose={() => setShowPasswordModal(false)}>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Password</button>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ============ STAT CARD ============
function StatCard({ label, value, total, subtext, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {total !== undefined && <span className="text-xs text-gray-400">of {total}</span>}
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  );
}

// ============ MODAL ============
function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ============ OVERVIEW TAB ============
function OverviewTab({ stats, sites, payments, isAdmin, isEngineer, onAdd }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Sites</h3>
        {(isAdmin || isEngineer) && (
          <button onClick={onAdd} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">+ New Site</button>
        )}
      </div>
      {sites.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No sites found</p>
      ) : (
        <div className="space-y-2">
          {sites.map((site: Site) => (
            <div key={site._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium">{site.name}</p>
                <p className="text-sm text-gray-500">{site.location} • {site.siteCode}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(site.status)}`}>{site.status}</span>
                <p className="text-sm font-medium mt-1">{formatCurrency(site.budget.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-semibold mt-6">Recent Payments</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No payments recorded</p>
      ) : (
        <div className="space-y-2">
          {payments.map((payment: Payment) => (
            <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium">{payment.recipientName}</p>
                <p className="text-sm text-gray-500">{payment.reference}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(payment.status)}`}>{payment.status}</span>
                <p className="text-sm font-medium mt-1">{formatCurrency(payment.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ SITES TAB ============
function SitesTab({ sites, isAdmin, isEngineer, searchTerm, setSearchTerm, filterStatus, setFilterStatus, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {(isAdmin || isEngineer) && (
          <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">+ New Site</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Code</th>
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Location</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Progress</th>
              <th className="text-left py-3 px-2">Budget</th>
              <th className="text-left py-3 px-2">Engineer</th>
              {(isAdmin || isEngineer) && <th className="text-left py-3 px-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sites.map((site: Site) => (
              <tr key={site._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2 font-mono">{site.siteCode}</td>
                <td className="py-2 px-2 font-medium">{site.name}</td>
                <td className="py-2 px-2">{site.location}</td>
                <td className="py-2 px-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(site.status)}`}>{site.status}</span></td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${getProgressColor(site.progress)}`} style={{ width: `${site.progress}%` }} />
                    </div>
                    <span>{site.progress}%</span>
                  </div>
                </td>
                <td className="py-2 px-2">{formatCurrency(site.budget.total)}</td>
                <td className="py-2 px-2">{site.engineerName || 'Unassigned'}</td>
                {(isAdmin || isEngineer) && (
                  <td className="py-2 px-2">
                    <div className="flex gap-1">
                      <button onClick={() => onEdit(site)} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                      {isAdmin && (
                        <button onClick={() => onDelete(site._id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {sites.length === 0 && (
              <tr><td colSpan={9} className="py-8 text-center text-gray-500">No sites found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ ENGINEERS TAB ============
function EngineersTab({ engineers, isAdmin, searchTerm, setSearchTerm, onAdd, onEdit, onDelete }: any) {
  if (!isAdmin) {
    return <p className="text-center py-8 text-gray-500">Only admins can manage engineers</p>;
  }

  const filtered = engineers.filter((e: Engineer) =>
    e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.engineerCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search engineers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800"
        />
        <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">+ New Engineer</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Code</th>
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-left py-3 px-2">Specialty</th>
              <th className="text-left py-3 px-2">Assigned Site</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((eng: Engineer) => (
              <tr key={eng._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2 font-mono">{eng.engineerCode}</td>
                <td className="py-2 px-2">{eng.firstName} {eng.lastName}</td>
                <td className="py-2 px-2">{eng.email}</td>
                <td className="py-2 px-2">{eng.specialty}</td>
                <td className="py-2 px-2">{eng.assignedSiteName || 'Unassigned'}</td>
                <td className="py-2 px-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(eng.status)}`}>{eng.status}</span></td>
                <td className="py-2 px-2">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(eng)} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                    <button onClick={() => onDelete(eng._id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-500">No engineers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ WORKERS TAB ============
function WorkersTab({ workers, isAdmin, isEngineer, searchTerm, setSearchTerm, filterStatus, setFilterStatus, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search workers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(isAdmin || isEngineer) && (
          <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">+ New Worker</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Code</th>
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Role</th>
              <th className="text-left py-3 px-2">Site</th>
              <th className="text-left py-3 px-2">Attendance</th>
              <th className="text-left py-3 px-2">Earned</th>
              <th className="text-left py-3 px-2">Status</th>
              {(isAdmin || isEngineer) && <th className="text-left py-3 px-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {workers.map((w: Worker) => (
              <tr key={w._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2 font-mono">{w.workerCode}</td>
                <td className="py-2 px-2">{w.firstName} {w.lastName}</td>
                <td className="py-2 px-2">{w.role}</td>
                <td className="py-2 px-2">{w.siteName || 'Unassigned'}</td>
                <td className="py-2 px-2">{w.attendanceRate}%</td>
                <td className="py-2 px-2">{formatCurrency(w.totalEarned)}</td>
                <td className="py-2 px-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(w.status)}`}>{w.status}</span></td>
                {(isAdmin || isEngineer) && (
                  <td className="py-2 px-2">
                    <div className="flex gap-1">
                      <button onClick={() => onEdit(w)} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                      {isAdmin && (
                        <button onClick={() => onDelete(w._id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {workers.length === 0 && (
              <tr><td colSpan={9} className="py-8 text-center text-gray-500">No workers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ MATERIALS TAB ============
function MaterialsTab({ materials, isAdmin, isEngineer, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {(isAdmin || isEngineer) && (
          <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add Material</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Code</th>
              <th className="text-left py-3 px-2">Name</th>
              <th className="text-left py-3 px-2">Category</th>
              <th className="text-left py-3 px-2">Stock</th>
              <th className="text-left py-3 px-2">Unit</th>
              <th className="text-left py-3 px-2">Unit Cost</th>
              <th className="text-left py-3 px-2">Status</th>
              {(isAdmin || isEngineer) && <th className="text-left py-3 px-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {materials.map((m: Material) => (
              <tr key={m._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2 font-mono">{m.materialCode}</td>
                <td className="py-2 px-2">{m.name}</td>
                <td className="py-2 px-2">{m.category}</td>
                <td className="py-2 px-2">{m.stock}</td>
                <td className="py-2 px-2">{m.unit}</td>
                <td className="py-2 px-2">{formatCurrency(m.unitCost)}</td>
                <td className="py-2 px-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(m.status)}`}>{m.status}</span></td>
                {(isAdmin || isEngineer) && (
                  <td className="py-2 px-2">
                    <div className="flex gap-1">
                      <button onClick={() => onEdit(m)} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                      <button onClick={() => onDelete(m._id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {materials.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-gray-500">No materials found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ PAYMENTS TAB ============
function PaymentsTab({ payments, isAdmin, isEngineer, onAdd, onDelete }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {(isAdmin || isEngineer) && (
          <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Record Payment</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Reference</th>
              <th className="text-left py-3 px-2">Recipient</th>
              <th className="text-left py-3 px-2">Type</th>
              <th className="text-left py-3 px-2">Site</th>
              <th className="text-left py-3 px-2">Amount</th>
              <th className="text-left py-3 px-2">Status</th>
              {(isAdmin || isEngineer) && <th className="text-left py-3 px-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payments.map((p: Payment) => (
              <tr key={p._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2 font-mono">{p.reference}</td>
                <td className="py-2 px-2">{p.recipientName}</td>
                <td className="py-2 px-2 capitalize">{p.recipientType}</td>
                <td className="py-2 px-2">{p.siteName || 'N/A'}</td>
                <td className="py-2 px-2 font-medium">{formatCurrency(p.amount)}</td>
                <td className="py-2 px-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(p.status)}`}>{p.status}</span></td>
                {(isAdmin || isEngineer) && (
                  <td className="py-2 px-2">
                    <button onClick={() => onDelete(p._id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-500">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ ATTENDANCE TAB ============
function AttendanceTab({ attendance, workers, isEngineer, onAdd }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isEngineer && (
          <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Record Attendance</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Worker</th>
              <th className="text-left py-3 px-2">Site</th>
              <th className="text-left py-3 px-2">Date</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Hours</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a: Attendance) => (
              <tr key={a._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2">{a.workerName}</td>
                <td className="py-2 px-2">{a.siteName || 'N/A'}</td>
                <td className="py-2 px-2">{new Date(a.date).toLocaleDateString()}</td>
                <td className="py-2 px-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(a.status)}`}>{a.status}</span></td>
                <td className="py-2 px-2">{a.hoursWorked}h</td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-gray-500">No attendance records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ SUPPLIERS TAB ============
function SuppliersTab({ suppliers, isAdmin, onAdd, onEdit, onDelete }: any) {
  if (!isAdmin) {
    return <p className="text-center py-8 text-gray-500">Only admins can manage suppliers</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add Supplier</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Company</th>
              <th className="text-left py-3 px-2">Contact</th>
              <th className="text-left py-3 px-2">Email</th>
              <th className="text-left py-3 px-2">Phone</th>
              <th className="text-left py-3 px-2">Category</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s: Supplier) => (
              <tr key={s._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2 font-medium">{s.companyName}</td>
                <td className="py-2 px-2">{s.contactName || '-'}</td>
                <td className="py-2 px-2">{s.email || '-'}</td>
                <td className="py-2 px-2">{s.phone || '-'}</td>
                <td className="py-2 px-2">{s.category || '-'}</td>
                <td className="py-2 px-2"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(s.status)}`}>{s.status}</span></td>
                <td className="py-2 px-2">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(s)} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                    <button onClick={() => onDelete(s._id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-500">No suppliers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ QUOTES & INVOICES TAB ============
function QuotesTab({ quotes, isAdmin, isEngineer, settings, onAdd, onEdit, onDelete, onUpdateStatus, formatCurrency }: any) {
  const [filterType, setFilterType] = useState('all');

  const filtered = quotes.filter((q: Quote) => {
    if (filterType === 'all') return true;
    return q.type === filterType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md dark:bg-gray-800"
          >
            <option value="all">All Documents</option>
            <option value="quotation">Quotations</option>
            <option value="invoice">Invoices</option>
          </select>
        </div>
        {(isAdmin || isEngineer) && (
          <div className="flex gap-2">
            <button onClick={() => onAdd({ type: 'quotation' })} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ New Quotation</button>
            <button onClick={() => onAdd({ type: 'invoice' })} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">+ New Invoice</button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">Doc #</th>
              <th className="text-left py-3 px-2">Type</th>
              <th className="text-left py-3 px-2">Client</th>
              <th className="text-left py-3 px-2">Site</th>
              <th className="text-left py-3 px-2">Total</th>
              <th className="text-left py-3 px-2">Status</th>
              <th className="text-left py-3 px-2">Payment</th>
              <th className="text-left py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q: Quote) => (
              <tr key={q._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-2 px-2 font-mono">{q.docNumber}</td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${q.type === 'invoice' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {q.type}
                  </span>
                </td>
                <td className="py-2 px-2">{q.clientName}</td>
                <td className="py-2 px-2">{q.siteName || 'N/A'}</td>
                <td className="py-2 px-2 font-medium">{formatCurrency(q.total)}</td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(q.status)}`}>
                    {q.status}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${q.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : q.paymentStatus === 'partially_paid' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {q.paymentStatus}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <div className="flex gap-1 flex-wrap">
                    <select
                      onChange={(e) => onUpdateStatus(q._id, e.target.value)}
                      value={q.status}
                      className="px-1 py-0.5 text-xs border rounded"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button onClick={() => onEdit(q)} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                    {(isAdmin || isEngineer) && (
                      <button onClick={() => onDelete(q._id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-gray-500">No documents found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Document Preview */}
      {settings && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border">
          <h4 className="font-medium mb-2">Branding Preview</h4>
          <div className="text-sm space-y-1">
            <p><strong>Company:</strong> {settings.companyName}</p>
            <p><strong>Slogan:</strong> {settings.slogan}</p>
            <p><strong>Address:</strong> {settings.address}</p>
            <p><strong>Phone:</strong> {settings.phone}</p>
            <p><strong>Email:</strong> {settings.email}</p>
            <p><strong>Tax Rate:</strong> {(settings.taxRate * 100)}%</p>
            <p><strong>Currency:</strong> {settings.currency}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ SETTINGS TAB ============
function SettingsTab({ settings, isAdmin, isEngineer, onEdit }: any) {
  if (!isAdmin && !isEngineer) {
    return <p className="text-center py-8 text-gray-500">Only admins and engineers can manage settings</p>;
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No settings configured</p>
        <button onClick={onEdit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Configure Settings</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Edit Settings</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <h4 className="font-semibold mb-2">Company Information</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Company:</strong> {settings.companyName}</p>
            <p><strong>Slogan:</strong> {settings.slogan}</p>
            <p><strong>Address:</strong> {settings.address}</p>
            <p><strong>Phone:</strong> {settings.phone}</p>
            <p><strong>Email:</strong> {settings.email}</p>
            <p><strong>Website:</strong> {settings.website || 'Not set'}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <h4 className="font-semibold mb-2">Document Settings</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Quote Prefix:</strong> {settings.quotePrefix}</p>
            <p><strong>Invoice Prefix:</strong> {settings.invoicePrefix}</p>
            <p><strong>Tax Rate:</strong> {(settings.taxRate * 100)}%</p>
            <p><strong>Currency:</strong> {settings.currency}</p>
            <p><strong>Terms:</strong> {settings.terms}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg col-span-1 md:col-span-2">
          <h4 className="font-semibold mb-2">Payment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div><strong>Bank:</strong> {settings.bankName || 'Not set'}</div>
            <div><strong>Account:</strong> {settings.accountName || 'Not set'}</div>
            <div><strong>Account #:</strong> {settings.accountNumber || 'Not set'}</div>
            <div><strong>Till #:</strong> {settings.tillNumber || 'Not set'}</div>
            <div><strong>M-Pesa:</strong> {settings.mpesaNumber || 'Not set'}</div>
            <div><strong>Signature:</strong> {settings.signatureName || 'Not set'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ FORMS ============
function SiteForm({ data, setData, onSubmit, onCancel, engineers, isEdit }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Site Name *</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={data.type || 'commercial'}
          onChange={(e) => setData({ ...data, type: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Assign Engineer</label>
        <select
          value={data.engineer || ''}
          onChange={(e) => setData({ ...data, engineer: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="">None</option>
          {engineers.map((e: Engineer) => (
            <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Total Budget</label>
          <input
            type="number"
            value={data.budget?.total || 0}
            onChange={(e) => setData({ ...data, budget: { ...data.budget, total: parseFloat(e.target.value) || 0 } })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={data.status || 'active'}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

function EngineerForm({ data, setData, onSubmit, onCancel, isEdit }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input
            type="text"
            value={data.firstName || ''}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name *</label>
          <input
            type="text"
            value={data.lastName || ''}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Specialty</label>
          <input
            type="text"
            value={data.specialty || 'Civil Engineering'}
            onChange={(e) => setData({ ...data, specialty: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Experience (Years)</label>
          <input
            type="number"
            value={data.experienceYears || 0}
            onChange={(e) => setData({ ...data, experienceYears: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Monthly Salary</label>
        <input
          type="number"
          value={data.monthlySalary || 0}
          onChange={(e) => setData({ ...data, monthlySalary: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>
      {!isEdit && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
          <p className="text-blue-700 dark:text-blue-300">A user account will be created for this engineer with a temporary password.</p>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

function WorkerForm({ data, setData, onSubmit, onCancel, sites, isEdit }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input
            type="text"
            value={data.firstName || ''}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name *</label>
          <input
            type="text"
            value={data.lastName || ''}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role *</label>
          <select
            value={data.role || ''}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          >
            <option value="">Select Role</option>
            <option value="Mason">Mason</option>
            <option value="Electrician">Electrician</option>
            <option value="Welder">Welder</option>
            <option value="Plumber">Plumber</option>
            <option value="Labourer">Labourer</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Foreman">Foreman</option>
            <option value="Painter">Painter</option>
            <option value="Scaffolder">Scaffolder</option>
            <option value="Site Clerk">Site Clerk</option>
            <option value="Steel Fixer">Steel Fixer</option>
            <option value="Tiler">Tiler</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Assign Site</label>
          <select
            value={data.site || ''}
            onChange={(e) => setData({ ...data, site: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          >
            <option value="">None</option>
            {sites.map((s: Site) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Daily Rate</label>
          <input
            type="number"
            value={data.dailyRate || 0}
            onChange={(e) => setData({ ...data, dailyRate: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

function MaterialForm({ data, setData, onSubmit, onCancel, sites, isEdit }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Material Name *</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            value={data.category || 'Concrete'}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          >
            <option value="Concrete">Concrete</option>
            <option value="Steel">Steel</option>
            <option value="Aggregate">Aggregate</option>
            <option value="Masonry">Masonry</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Formwork">Formwork</option>
            <option value="Roofing">Roofing</option>
            <option value="Finishing">Finishing</option>
            <option value="Safety">Safety</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            value={data.stock || 0}
            onChange={(e) => setData({ ...data, stock: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <input
            type="text"
            value={data.unit || 'pcs'}
            onChange={(e) => setData({ ...data, unit: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit Cost</label>
          <input
            type="number"
            value={data.unitCost || 0}
            onChange={(e) => setData({ ...data, unitCost: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Reorder Level</label>
          <input
            type="number"
            value={data.reorderLevel || 10}
            onChange={(e) => setData({ ...data, reorderLevel: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Assign Site</label>
          <select
            value={data.site || ''}
            onChange={(e) => setData({ ...data, site: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          >
            <option value="">None</option>
            {sites.map((s: Site) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

function PaymentForm({ data, setData, onSubmit, onCancel, workers, engineers }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient Type *</label>
          <select
            value={data.recipientType || 'worker'}
            onChange={(e) => setData({ ...data, recipientType: e.target.value, recipient: '' })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          >
            <option value="worker">Worker</option>
            <option value="engineer">Engineer</option>
            <option value="supplier">Supplier</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recipient</label>
          <select
            value={data.recipient || ''}
            onChange={(e) => {
              const val = e.target.value;
              const list = data.recipientType === 'worker' ? workers : engineers;
              const found = list.find((item: any) => item._id === val);
              setData({
                ...data,
                recipient: val,
                recipientName: found ? `${found.firstName} ${found.lastName}` : ''
              });
            }}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          >
            <option value="">Select</option>
            {(data.recipientType === 'worker' ? workers : engineers).map((item: any) => (
              <option key={item._id} value={item._id}>
                {item.firstName} {item.lastName} - {item.role || item.specialty}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount *</label>
          <input
            type="number"
            value={data.amount || 0}
            onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={data.status || 'pending'}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <select
          value={data.paymentMethod || 'Cash'}
          onChange={(e) => setData({ ...data, paymentMethod: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="M-Pesa">M-Pesa</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Record</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

function AttendanceForm({ data, setData, onSubmit, onCancel, workers }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Worker *</label>
        <select
          value={data.worker || ''}
          onChange={(e) => setData({ ...data, worker: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          required
        >
          <option value="">Select Worker</option>
          {workers.map((w: Worker) => (
            <option key={w._id} value={w._id}>{w.firstName} {w.lastName}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <input
          type="date"
          value={data.date || new Date().toISOString().split('T')[0]}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status *</label>
        <select
          value={data.status || 'present'}
          onChange={(e) => setData({ ...data, status: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          required
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="half_day">Half Day</option>
          <option value="late">Late</option>
          <option value="overtime">Overtime</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hours Worked</label>
        <input
          type="number"
          value={data.hoursWorked || 0}
          onChange={(e) => setData({ ...data, hoursWorked: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          step="0.5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <input
          type="text"
          value={data.note || ''}
          onChange={(e) => setData({ ...data, note: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Record</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

function SupplierForm({ data, setData, onSubmit, onCancel, isEdit }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Company Name *</label>
        <input
          type="text"
          value={data.companyName || ''}
          onChange={(e) => setData({ ...data, companyName: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contact Name</label>
          <input
            type="text"
            value={data.contactName || ''}
            onChange={(e) => setData({ ...data, contactName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={data.category || ''}
            onChange={(e) => setData({ ...data, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={data.address || ''}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={data.status || 'active'}
          onChange={(e) => setData({ ...data, status: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

// ============ QUOTE FORM ============
function QuoteForm({ data, setData, onSubmit, onCancel, sites, settings, isEdit, formatCurrency }: any) {
  const [items, setItems] = useState<QuoteItem[]>(data.items || [{ name: '', qty: 1, unit: 'pcs', price: 0, total: 0 }]);

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, unit: 'pcs', price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    if (field === 'qty' || field === 'price') {
      item.total = (item.qty || 0) * (item.price || 0);
    }
    newItems[index] = item;
    setItems(newItems);
    setData({ ...data, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountAmount = data.discountType === 'percentage' ? subtotal * ((data.discount || 0) / 100) : (data.discount || 0);
    const tax = (subtotal - discountAmount) * (data.taxRate || settings?.taxRate || 0.075);
    const total = subtotal - discountAmount + tax + (data.transport || 0);
    return { subtotal, tax, total, discountAmount };
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <select
            value={data.type || 'quotation'}
            onChange={(e) => setData({ ...data, type: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          >
            <option value="quotation">Quotation</option>
            <option value="invoice">Invoice</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client Name *</label>
          <input
            type="text"
            value={data.clientName || ''}
            onChange={(e) => setData({ ...data, clientName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client Email</label>
          <input
            type="email"
            value={data.clientEmail || ''}
            onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client Phone</label>
          <input
            type="text"
            value={data.clientPhone || ''}
            onChange={(e) => setData({ ...data, clientPhone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Site</label>
        <select
          value={data.site || ''}
          onChange={(e) => {
            const site = sites.find((s: Site) => s._id === e.target.value);
            setData({ ...data, site: e.target.value, siteName: site?.name || '' });
          }}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="">None</option>
          {sites.map((s: Site) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Client Address</label>
        <input
          type="text"
          value={data.clientAddress || ''}
          onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>

      {/* Items */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Items *</label>
          <button type="button" onClick={addItem} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Item</button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex flex-wrap gap-2 items-end bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
              <div className="flex-1 min-w-[120px]">
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => updateItem(index, 'name', e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800"
                />
              </div>
              <div className="w-16">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800"
                  min="0"
                />
              </div>
              <div className="w-20">
                <input
                  type="text"
                  placeholder="Unit"
                  value={item.unit}
                  onChange={(e) => updateItem(index, 'unit', e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800"
                  min="0"
                />
              </div>
              <div className="w-24 text-sm font-medium">
                {formatCurrency(item.total || 0)}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                disabled={items.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
          <input
            type="number"
            value={(data.taxRate || settings?.taxRate || 0.075) * 100}
            onChange={(e) => setData({ ...data, taxRate: parseFloat(e.target.value) / 100 || 0 })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={data.discount || 0}
              onChange={(e) => setData({ ...data, discount: parseFloat(e.target.value) || 0 })}
              className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800"
              min="0"
            />
            <select
              value={data.discountType || 'percentage'}
              onChange={(e) => setData({ ...data, discountType: e.target.value })}
              className="px-3 py-2 border rounded-md dark:bg-gray-800"
            >
              <option value="percentage">%</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Transport</label>
        <input
          type="number"
          value={data.transport || 0}
          onChange={(e) => setData({ ...data, transport: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          min="0"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(totals.subtotal)}</span></div>
        <div className="flex justify-between text-emerald-600"><span>Discount:</span><span>-{formatCurrency(totals.discountAmount)}</span></div>
        <div className="flex justify-between"><span>Tax ({((data.taxRate || settings?.taxRate || 0.075) * 100).toFixed(1)}%):</span><span>{formatCurrency(totals.tax)}</span></div>
        <div className="flex justify-between"><span>Transport:</span><span>{formatCurrency(data.transport || 0)}</span></div>
        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>{formatCurrency(totals.total)}</span></div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <input
          type="text"
          value={data.notes || ''}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {isEdit ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

// ============ SETTINGS FORM ============
function SettingsForm({ data, setData, onSubmit, onCancel }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            type="text"
            value={data.companyName || ''}
            onChange={(e) => setData({ ...data, companyName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slogan</label>
          <input
            type="text"
            value={data.slogan || ''}
            onChange={(e) => setData({ ...data, slogan: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={data.address || ''}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Website</label>
        <input
          type="text"
          value={data.website || ''}
          onChange={(e) => setData({ ...data, website: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quote Prefix</label>
          <input
            type="text"
            value={data.quotePrefix || 'BC-Q'}
            onChange={(e) => setData({ ...data, quotePrefix: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Prefix</label>
          <input
            type="text"
            value={data.invoicePrefix || 'BC-INV'}
            onChange={(e) => setData({ ...data, invoicePrefix: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <input
            type="text"
            value={data.currency || 'KES'}
            onChange={(e) => setData({ ...data, currency: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
        <input
          type="number"
          value={(data.taxRate || 0.075) * 100}
          onChange={(e) => setData({ ...data, taxRate: parseFloat(e.target.value) / 100 || 0 })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          step="0.1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Terms</label>
        <input
          type="text"
          value={data.terms || ''}
          onChange={(e) => setData({ ...data, terms: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <input
          type="text"
          value={data.notes || ''}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bank Name</label>
          <input
            type="text"
            value={data.bankName || ''}
            onChange={(e) => setData({ ...data, bankName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Account Name</label>
          <input
            type="text"
            value={data.accountName || ''}
            onChange={(e) => setData({ ...data, accountName: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Account Number</label>
          <input
            type="text"
            value={data.accountNumber || ''}
            onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Till Number</label>
          <input
            type="text"
            value={data.tillNumber || ''}
            onChange={(e) => setData({ ...data, tillNumber: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">M-Pesa Number</label>
          <input
            type="text"
            value={data.mpesaNumber || ''}
            onChange={(e) => setData({ ...data, mpesaNumber: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Signature Name</label>
        <input
          type="text"
          value={data.signatureName || ''}
          onChange={(e) => setData({ ...data, signatureName: e.target.value })}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Settings</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}