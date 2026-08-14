import api from './api';

// ============ TYPES ============
export interface ConstructionSite {
  _id: string;
  siteCode: string;
  name: string;
  siteType: string;
  location: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  engineer?: string;
  engineerName?: string;
  workers: number;
  budget: number;
  amountSpent: number;
  startDate: string;
  expectedEndDate: string;
  clientName?: string;
  clientPhone?: string;
  description?: string;
  createdAt: string;
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
  createdAt: string;
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
  status: 'active' | 'inactive';
  createdAt: string;
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
  lastDelivery: string;
  supplier?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: string;
}

export interface AttendanceRecord {
  _id: string;
  worker: string;
  workerName: string;
  site?: string;
  siteName?: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'late';
  hoursWorked: number;
  createdAt: string;
}

export interface PaymentRecord {
  _id: string;
  reference: string;
  recipientType: 'worker' | 'engineer' | 'supplier';
  recipient?: string;
  recipientName: string;
  site?: string;
  siteName?: string;
  amount: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
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
  createdAt: string;
}

export interface DashboardOverview {
  stats: {
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
  };
  sites: ConstructionSite[];
  workers: Worker[];
  payments: PaymentRecord[];
  materials: Material[];
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
  createEngineer: async (data: Partial<Engineer>): Promise<Engineer> => {
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
  getMaterials: async (params?: { site?: string; status?: string }): Promise<Material[]> => {
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
  getAttendance: async (params?: { site?: string; date?: string; worker?: string }): Promise<AttendanceRecord[]> => {
    const response = await api.get('/construction/attendance', { params });
    return response.data.attendance;
  },
  createAttendance: async (data: { worker: string; date: string; status: string; hoursWorked?: number }): Promise<AttendanceRecord> => {
    const response = await api.post('/construction/attendance', data);
    return response.data.attendance;
  },

  // Payments
  getPayments: async (params?: { status?: string; recipientType?: string }): Promise<PaymentRecord[]> => {
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
};

// ============ FORMATTING HELPERS ============
export const formatNaira = (amount: number): string => {
  return `₦${(amount || 0).toLocaleString()}`;
};

export const formatNairaCompact = (amount: number): string => {
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(1)}K`;
  return `₦${amount || 0}`;
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
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
  };
  return map[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 75) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-amber-500';
  return 'bg-red-500';
};
