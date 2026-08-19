import api from './api';

// ============ TYPES ============
export interface ConstructionSite {
  _id: string;
  siteCode: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'mixed';
  location: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  progress: number;
  engineer?: string;
  engineerName?: string;
  clientName?: string;
  clientPhone?: string;
  workerCount: number;
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  startDate?: string;
  expectedEndDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Engineer {
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
  user?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Worker {
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
  idNumber?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
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
  lastDelivery?: string;
  supplier?: string;
  supplierName?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  _id: string;
  worker: string;
  workerName: string;
  site?: string;
  siteName?: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'late' | 'overtime';
  hoursWorked: number;
  note?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  _id: string;
  reference: string;
  recipientType: 'worker' | 'engineer' | 'supplier' | 'other';
  recipient?: string;
  recipientName: string;
  site?: string;
  siteName?: string;
  amount: number;
  currency: string;
  periodStart?: string;
  periodEnd?: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConstructionSupplier {
  _id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  materials?: string[];
  paymentTerms?: string;
  leadTimeDays?: number;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
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

export interface DashboardOverview {
  stats: DashboardStats;
  sites: ConstructionSite[];
  workers: Worker[];
  payments: PaymentRecord[];
  materials: Material[];
  role?: string;
}

export interface QuoteItem {
  name: string;
  description?: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
}

export interface ConstructionQuote {
  _id: string;
  docNumber: string;
  type: 'quotation' | 'invoice';
  engineer?: string;
  ownedBy?: string;
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

export interface EngineerSettings {
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

// ============ API FUNCTIONS ============
export const constructionApi = {
  // Overview
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get('/construction/overview');
    return response.data.data;
  },

  // Sites
  getSites: async (params?: { status?: string; search?: string }): Promise<ConstructionSite[]> => {
    const response = await api.get('/construction/sites', { params });
    return response.data.sites;
  },
  getSite: async (id: string): Promise<ConstructionSite> => {
    const response = await api.get(`/construction/sites/${id}`);
    return response.data.site;
  },
  createSite: async (data: Partial<ConstructionSite>): Promise<ConstructionSite> => {
    const response = await api.post('/construction/sites', data);
    return response.data.site;
  },
  updateSite: async (id: string, data: Partial<ConstructionSite>): Promise<ConstructionSite> => {
    const response = await api.put(`/construction/sites/${id}`, data);
    return response.data.site;
  },
  deleteSite: async (id: string): Promise<void> => {
    await api.delete(`/construction/sites/${id}`);
  },

  // Workers
  getWorkers: async (params?: { status?: string; search?: string; site?: string }): Promise<Worker[]> => {
    const response = await api.get('/construction/workers', { params });
    return response.data.workers;
  },
  createWorker: async (data: Partial<Worker>): Promise<Worker> => {
    const response = await api.post('/construction/workers', data);
    return response.data.worker;
  },
  updateWorker: async (id: string, data: Partial<Worker>): Promise<Worker> => {
    const response = await api.put(`/construction/workers/${id}`, data);
    return response.data.worker;
  },
  deleteWorker: async (id: string): Promise<void> => {
    await api.delete(`/construction/workers/${id}`);
  },

  // Engineers
  getEngineers: async (params?: { search?: string }): Promise<Engineer[]> => {
    const response = await api.get('/construction/engineers', { params });
    return response.data.engineers;
  },
  createEngineer: async (data: Partial<Engineer> & { createUserAccount?: boolean; linkedUserId?: string }): Promise<Engineer> => {
    const response = await api.post('/construction/engineers', data);
    return response.data.engineer;
  },
  updateEngineer: async (id: string, data: Partial<Engineer>): Promise<Engineer> => {
    const response = await api.put(`/construction/engineers/${id}`, data);
    return response.data.engineer;
  },
  deleteEngineer: async (id: string): Promise<void> => {
    await api.delete(`/construction/engineers/${id}`);
  },

  // Materials
  getMaterials: async (params?: { site?: string; status?: string; category?: string }): Promise<Material[]> => {
    const response = await api.get('/construction/materials', { params });
    return response.data.materials;
  },
  createMaterial: async (data: Partial<Material>): Promise<Material> => {
    const response = await api.post('/construction/materials', data);
    return response.data.material;
  },
  updateMaterial: async (id: string, data: Partial<Material>): Promise<Material> => {
    const response = await api.put(`/construction/materials/${id}`, data);
    return response.data.material;
  },
  deleteMaterial: async (id: string): Promise<void> => {
    await api.delete(`/construction/materials/${id}`);
  },

  // Attendance
  getAttendance: async (params?: { site?: string; date?: string; worker?: string; status?: string }): Promise<AttendanceRecord[]> => {
    const response = await api.get('/construction/attendance', { params });
    return response.data.attendance;
  },
  createAttendance: async (data: { worker: string; date: string; status: string; hoursWorked?: number; note?: string }): Promise<AttendanceRecord> => {
    const response = await api.post('/construction/attendance', data);
    return response.data.attendance;
  },

  // Payments
  getPayments: async (params?: { status?: string; recipientType?: string; search?: string }): Promise<PaymentRecord[]> => {
    const response = await api.get('/construction/payments', { params });
    return response.data.payments;
  },
  createPayment: async (data: Partial<PaymentRecord>): Promise<PaymentRecord> => {
    const response = await api.post('/construction/payments', data);
    return response.data.payment;
  },
  updatePayment: async (id: string, data: Partial<PaymentRecord>): Promise<PaymentRecord> => {
    const response = await api.put(`/construction/payments/${id}`, data);
    return response.data.payment;
  },
  deletePayment: async (id: string): Promise<void> => {
    await api.delete(`/construction/payments/${id}`);
  },

  // Suppliers
  getSuppliers: async (params?: { search?: string }): Promise<ConstructionSupplier[]> => {
    const response = await api.get('/construction/suppliers', { params });
    return response.data.suppliers;
  },
  createSupplier: async (data: Partial<ConstructionSupplier>): Promise<ConstructionSupplier> => {
    const response = await api.post('/construction/suppliers', data);
    return response.data.supplier;
  },
  updateSupplier: async (id: string, data: Partial<ConstructionSupplier>): Promise<ConstructionSupplier> => {
    const response = await api.put(`/construction/suppliers/${id}`, data);
    return response.data.supplier;
  },
  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete(`/construction/suppliers/${id}`);
  },

  // Quotes
  getQuotes: async (params?: { type?: string }): Promise<ConstructionQuote[]> => {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    const response = await api.get(`/construction/quotes?${query.toString()}`);
    return response.data.quotes || [];
  },
  getQuote: async (id: string): Promise<ConstructionQuote> => {
    const response = await api.get(`/construction/quotes/${id}`);
    return response.data.quote;
  },
  createQuote: async (data: Partial<ConstructionQuote>): Promise<ConstructionQuote> => {
    const response = await api.post('/construction/quotes', data);
    return response.data.quote;
  },
  updateQuote: async (id: string, data: Partial<ConstructionQuote>): Promise<ConstructionQuote> => {
    const response = await api.put(`/construction/quotes/${id}`, data);
    return response.data.quote;
  },
  deleteQuote: async (id: string): Promise<void> => {
    await api.delete(`/construction/quotes/${id}`);
  },

  // Settings
  getSettings: async (): Promise<EngineerSettings | null> => {
    try {
      const response = await api.get('/construction/settings');
      return response.data.settings || null;
    } catch {
      return null;
    }
  },
  saveSettings: async (data: Partial<EngineerSettings>): Promise<EngineerSettings> => {
    const response = await api.put('/construction/settings', data);
    return response.data.settings;
  },
};

// ============ FORMATTING HELPERS ============
export const formatCurrency = (amount: number): string => {
  return (amount || 0).toLocaleString();
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
};

export const getFullName = (firstName: string, lastName: string): string => {
  return `${firstName || ''} ${lastName || ''}`.trim();
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    in_stock: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    low_stock: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    out_of_stock: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    absent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    half_day: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    late: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    overtime: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    expired: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    partially_paid: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  };
  return map[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 75) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-amber-500';
  return 'bg-red-500';
};

export const getRoleBadgeColor = (role: string): string => {
  const map: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    engineer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    worker: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    user: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };
  return map[role] || map.user;
};