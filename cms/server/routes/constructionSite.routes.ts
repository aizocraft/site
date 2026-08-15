import { Router, Request, Response } from 'express';
import ConstructionSiteModel from '../models/ConstructionSite';
import EngineerModel from '../models/Engineer';
import WorkerModel from '../models/Worker';
import MaterialModel from '../models/Material';
import AttendanceModel from '../models/Attendance';
import PaymentRecordModel from '../models/PaymentRecord';
import ConstructionSupplierModel from '../models/ConstructionSupplier';
import authMiddleware from '../middleware/auth';

const router = Router();

// Helper: generate sequential codes
const CODE_FIELD: Record<string, string> = {
  S: 'siteCode',
  W: 'workerCode',
  E: 'engineerCode',
  M: 'materialCode',
};
const nextCode = async (prefix: string, Model: any): Promise<string> => {
  const field = CODE_FIELD[prefix] || `${prefix.toLowerCase()}Code`;
  const last = await Model.findOne().sort({ createdAt: -1 }).lean();
  const lastNum = last ? parseInt((last[field] || '100').replace(/\D/g, '')) : 100;
  return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
};

// Compute material stock status from stock vs reorder level
const computeMaterialStatus = (stock: number, reorderLevel: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= reorderLevel) return 'low_stock';
  return 'in_stock';
};

// Any authenticated user can access (per requirement: each user can manage & add sites)
router.use(authMiddleware);

// ============ DASHBOARD OVERVIEW ============
router.get('/overview', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = req.user!.userId;
    const [sites, workers, engineers, materials, payments, suppliers] = await Promise.all([
      ConstructionSiteModel.find({ createdBy: userId }).lean(),
      WorkerModel.find({ createdBy: userId }).lean(),
      EngineerModel.find({ createdBy: userId }).lean(),
      MaterialModel.find({ createdBy: userId }).lean(),
      PaymentRecordModel.find({ createdBy: userId }).lean(),
      ConstructionSupplierModel.find({ createdBy: userId }).lean(),
    ]);

    const activeSites = sites.filter(s => s.status === 'active');
    const totalBudget = sites.reduce((sum, s) => sum + Number(s.budget?.total || 0), 0);
    const totalSpent = sites.reduce((sum, s) => sum + Number(s.budget?.spent || 0), 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
    const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + (p.amount || 0), 0);
    const paidCount = payments.filter(p => p.status === 'paid').length;
    const pendingCount = payments.filter(p => p.status === 'pending').length;
    const overdueCount = payments.filter(p => p.status === 'overdue').length;
    const lowStock = materials.filter(m => m.status !== 'in_stock').length;
    const totalInventoryValue = materials.reduce((sum, m) => sum + (m.totalValue || 0), 0);

    res.json({
      success: true,
      data: {
        stats: {
          activeSites: activeSites.length,
          totalSites: sites.length,
          activeWorkers: workers.filter(w => w.status === 'active').length,
          totalWorkers: workers.length,
          totalBudget,
          totalSpent,
          remainingBudget: totalBudget - totalSpent,
          pendingAmount,
          overdueAmount,
          pendingPayments: pendingAmount,
          paidCount,
          pendingCount,
          overdueCount,
          totalEngineers: engineers.length,
          totalMaterials: materials.length,
          lowStock,
          totalInventoryValue,
          totalSuppliers: suppliers.length,
        },
        sites,
        workers,
        payments,
        materials,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SITES ============
router.get('/sites', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { status, search } = req.query;
    const query: any = { createdBy: req.user!.userId };
    if (status && status !== 'all') query.status = status;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { location: { $regex: search, $options: 'i' } }];
    const sites = await ConstructionSiteModel.find(query).sort({ createdAt: -1 }).lean();
    res.json({ sites });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sites', async (req: Request & { user?: any }, res: Response) => {
  try {
    const code = await nextCode('S', ConstructionSiteModel);
    const site = new ConstructionSiteModel({ ...req.body, siteCode: code, createdBy: req.user!.userId });
    await site.save();
    // If engineer assigned, update engineer
    if (site.engineer) {
      await EngineerModel.findByIdAndUpdate(site.engineer, { assignedSite: site._id, assignedSiteName: site.name, status: 'active' });
    }
    res.status(201).json({ site });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const site = await ConstructionSiteModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!site) return res.status(404).json({ error: 'Site not found' });
    if (site.engineer) {
      await EngineerModel.findByIdAndUpdate(site.engineer, { assignedSite: site._id, assignedSiteName: site.name });
    }
    res.json({ site });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    await ConstructionSiteModel.findByIdAndDelete(req.params.id);
    // Unassign engineers/workers tied to this site
    await EngineerModel.updateMany({ assignedSite: req.params.id }, { assignedSite: undefined, assignedSiteName: undefined });
    await WorkerModel.updateMany({ site: req.params.id }, { site: undefined, siteName: undefined });
    res.json({ success: true, message: 'Site deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ WORKERS ============
router.get('/workers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { status, search, site } = req.query;
    const query: any = { createdBy: req.user!.userId };
    if (status && status !== 'all') query.status = status;
    if (site) query.site = site;
    if (search) query.$or = [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { role: { $regex: search, $options: 'i' } }];
    const workers = await WorkerModel.find(query).sort({ createdAt: -1 }).lean();
    res.json({ workers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/workers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const code = await nextCode('W', WorkerModel);
    const worker = new WorkerModel({ ...req.body, workerCode: code, createdBy: req.user!.userId });
    await worker.save();
    // Update site worker count
    if (worker.site) {
      const count = await WorkerModel.countDocuments({ site: worker.site, status: 'active' });
      await ConstructionSiteModel.findByIdAndUpdate(worker.site, { workers: count });
    }
    res.status(201).json({ worker });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/workers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const worker = await WorkerModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    if (worker.site) {
      const count = await WorkerModel.countDocuments({ site: worker.site, status: 'active' });
      await ConstructionSiteModel.findByIdAndUpdate(worker.site, { workers: count });
    }
    res.json({ worker });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/workers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const worker = await WorkerModel.findByIdAndDelete(req.params.id);
    if (worker?.site) {
      const count = await WorkerModel.countDocuments({ site: worker.site, status: 'active' });
      await ConstructionSiteModel.findByIdAndUpdate(worker.site, { workers: count });
    }
    res.json({ success: true, message: 'Worker deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENGINEERS ============
router.get('/engineers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { search } = req.query;
    const query: any = { createdBy: req.user!.userId };
    if (search) query.$or = [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { specialty: { $regex: search, $options: 'i' } }];
    const engineers = await EngineerModel.find(query).sort({ createdAt: -1 }).lean();
    res.json({ engineers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/engineers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const code = await nextCode('E', EngineerModel);
    const engineer = new EngineerModel({ ...req.body, engineerCode: code, createdBy: req.user!.userId });
    await engineer.save();
    if (engineer.assignedSite) {
      await ConstructionSiteModel.findByIdAndUpdate(engineer.assignedSite, { engineer: engineer._id, engineerName: `${engineer.firstName} ${engineer.lastName}` });
    }
    res.status(201).json({ engineer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/engineers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const engineer = await EngineerModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!engineer) return res.status(404).json({ error: 'Engineer not found' });
    if (engineer.assignedSite) {
      await ConstructionSiteModel.findByIdAndUpdate(engineer.assignedSite, { engineer: engineer._id, engineerName: `${engineer.firstName} ${engineer.lastName}` });
    }
    res.json({ engineer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/engineers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    await EngineerModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Engineer deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ MATERIALS ============
router.get('/materials', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { site, status } = req.query;
    const query: any = { createdBy: req.user!.userId };
    if (site && site !== 'all') query.site = site;
    if (status && status !== 'all') query.status = status;
    const materials = await MaterialModel.find(query).sort({ createdAt: -1 }).lean();
    res.json({ materials });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/materials', async (req: Request & { user?: any }, res: Response) => {
  try {
    const code = await nextCode('M', MaterialModel);
    const data = { ...req.body, totalValue: (req.body.stock || 0) * (req.body.unitCost || 0) };
    const material = new MaterialModel({ ...data, materialCode: code, createdBy: req.user!.userId });
    await material.save();
    res.status(201).json({ material });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/materials/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const existing = await MaterialModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Material not found' });
    const stock = req.body.stock !== undefined ? req.body.stock : existing.stock;
    const unitCost = req.body.unitCost !== undefined ? req.body.unitCost : existing.unitCost;
    const reorderLevel = req.body.reorderLevel !== undefined ? req.body.reorderLevel : existing.reorderLevel;
    const status = computeMaterialStatus(stock, reorderLevel);
    const data = { ...req.body, totalValue: stock * unitCost, status };
    const material = await MaterialModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ material });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/materials/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    await MaterialModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Material deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ATTENDANCE ============
router.get('/attendance', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { site, date, worker } = req.query;
    const query: any = { createdBy: req.user!.userId };
    if (site) query.site = site;
    if (worker) query.worker = worker;
    if (date) {
      const d = new Date(date as string);
      const start = new Date(d); start.setHours(0,0,0,0);
      const end = new Date(d); end.setHours(23,59,59,999);
      query.date = { $gte: start, $lte: end };
    }
    const attendance = await AttendanceModel.find(query).sort({ date: -1 }).lean();
    res.json({ attendance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/attendance', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { worker, date, status, hoursWorked } = req.body;
    const workerData = await WorkerModel.findById(worker);
    if (!workerData) return res.status(404).json({ error: 'Worker not found' });
    const d = new Date(date);
    const start = new Date(d); start.setHours(0,0,0,0);
    const end = new Date(d); end.setHours(23,59,59,999);
// Upsert to avoid duplicates — match exact date to align with unique {worker, date} index
    const attendance = await AttendanceModel.findOneAndUpdate(
      { worker, date: start },
      {
        worker,
        workerName: `${workerData.firstName} ${workerData.lastName}`,
        site: workerData.site,
        siteName: workerData.siteName,
        date: start,
        status,
        hoursWorked: hoursWorked || (status === 'present' ? 8 : status === 'half_day' ? 4 : 0),
        createdBy: req.user!.userId,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    // Update attendance rate
    const total = await AttendanceModel.countDocuments({ worker });
    const present = await AttendanceModel.countDocuments({ worker, status: { $in: ['present', 'late'] } });
    const halfDay = await AttendanceModel.countDocuments({ worker, status: 'half_day' });
    const rate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 100;
    await WorkerModel.findByIdAndUpdate(worker, { attendanceRate: rate });
    res.status(201).json({ attendance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PAYMENTS ============
router.get('/payments', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { status, recipientType } = req.query;
    const query: any = { createdBy: req.user!.userId };
    if (status && status !== 'all') query.status = status;
    if (recipientType && recipientType !== 'all') query.recipientType = recipientType;
    const payments = await PaymentRecordModel.find(query).sort({ createdAt: -1 }).lean();
    res.json({ payments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payments', async (req: Request & { user?: any }, res: Response) => {
  try {
    const reference = `PYM-${Date.now()}`;
    const payment = new PaymentRecordModel({ ...req.body, reference, createdBy: req.user!.userId });
    await payment.save();
    // If worker payment, update total earned
    if (payment.recipientType === 'worker' && payment.recipient && payment.status === 'paid') {
      await WorkerModel.findByIdAndUpdate(payment.recipient, { $inc: { totalEarned: payment.amount } });
    }
    res.status(201).json({ payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/payments/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const existing = await PaymentRecordModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Payment not found' });

    const payment = await PaymentRecordModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    // Adjust worker totalEarned by delta to avoid double-counting
    if (payment.recipientType === 'worker' && payment.recipient) {
      const wasPaid = existing.status === 'paid';
      const isPaid = payment.status === 'paid';
      if (wasPaid && !isPaid) {
        await WorkerModel.findByIdAndUpdate(payment.recipient, { $inc: { totalEarned: -existing.amount } });
      } else if (!wasPaid && isPaid) {
        await WorkerModel.findByIdAndUpdate(payment.recipient, { $inc: { totalEarned: payment.amount } });
      } else if (wasPaid && isPaid && existing.amount !== payment.amount) {
        await WorkerModel.findByIdAndUpdate(payment.recipient, { $inc: { totalEarned: payment.amount - existing.amount } });
      }
    }
    res.json({ payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/payments/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const payment = await PaymentRecordModel.findByIdAndDelete(req.params.id);
    // If a paid worker payment is deleted, subtract from totalEarned
    if (payment?.recipientType === 'worker' && payment?.recipient && payment?.status === 'paid') {
      await WorkerModel.findByIdAndUpdate(payment.recipient, { $inc: { totalEarned: -payment.amount } });
    }
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SUPPLIERS ============
router.get('/suppliers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const { search } = req.query;
    const query: any = { createdBy: req.user!.userId };
    if (search) query.$or = [{ companyName: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }];
    const suppliers = await ConstructionSupplierModel.find(query).sort({ companyName: 1 }).lean();
    res.json({ suppliers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/suppliers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const supplier = new ConstructionSupplierModel({ ...req.body, createdBy: req.user!.userId });
    await supplier.save();
    res.status(201).json({ supplier });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/suppliers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const supplier = await ConstructionSupplierModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ supplier });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/suppliers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    await ConstructionSupplierModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
