import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import mongoose from 'mongoose';
import ConstructionSiteModel from '../models/ConstructionSite';
import ConstructionEngineerModel from '../models/ConstructionEngineer';
import ConstructionWorkerModel from '../models/ConstructionWorker';
import AttendanceRecordModel from '../models/AttendanceRecord';
import ConstructionPaymentModel from '../models/ConstructionPayment';
import ConstructionMaterialModel from '../models/ConstructionMaterial';
import ConstructionSupplierModel from '../models/ConstructionSupplier';
import ConstructionQuoteModel, { generateConstructionDocNumber } from '../models/ConstructionQuote';
import EngineerSettingsModel from '../models/EngineerSettings';
import UserModel from '../models/User';

const router = Router();

// All construction routes require auth
router.use(authMiddleware);

// Helper: get ownedBy from req.user
const ownedBy = (req: Request & { user?: any }) => req.user?.userId;

const isAdmin = (req: Request & { user?: any }) => req.user?.role === 'admin';
const isEngineer = (req: Request & { user?: any }) => req.user?.role === 'engineer';
const canAccessConstructionData = (req: Request & { user?: any }) => isAdmin(req) || isEngineer(req);

const getConstructionAccessFilter = (req: Request & { user?: any }, extraFilter: Record<string, any> = {}) => {
  const owner = ownedBy(req);
  if (isAdmin(req)) {
    return extraFilter;
  }
  return { ...extraFilter, ownedBy: owner };
};

// ============================================================================
// DASHBOARD STATS
// ============================================================================
router.get('/dashboard/stats', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);

    // Admins see all; engineers and other roles only see their own records
    const siteFilter = isAdministrator ? {} : { ownedBy: owner };
    const match = isAdministrator ? {} : { ownedBy: owner };

    const [siteCount, activeSites, engineerCount, workerCount, activeWorkers, materialCount, supplierCount] = await Promise.all([
      ConstructionSiteModel.countDocuments(siteFilter),
      ConstructionSiteModel.countDocuments({ ...siteFilter, status: 'active' }),
      ConstructionEngineerModel.countDocuments(match),
      ConstructionWorkerModel.countDocuments(match),
      ConstructionWorkerModel.countDocuments({ ...match, status: 'active' }),
      ConstructionMaterialModel.countDocuments(match),
      ConstructionSupplierModel.countDocuments(match),
    ]);

    // Budget aggregation
    let totalBudget = 0, totalSpent = 0;
    const sites = await ConstructionSiteModel.find(siteFilter).lean();
    sites.forEach(s => {
      totalBudget += s.budget?.total || 0;
      totalSpent += s.budget?.spent || 0;
    });

    // Payments aggregation
    const paymentAgg = await ConstructionPaymentModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    let pendingPayments = 0;
    const paymentStatusBreakdown: Record<string, { total: number; count: number }> = {};
    paymentAgg.forEach(p => {
      paymentStatusBreakdown[p._id] = { total: p.total, count: p.count };
      if (p._id === 'pending' || p._id === 'overdue') pendingPayments += p.total;
    });

    // Monthly expenditure (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const monthlyExpenditure = await ConstructionPaymentModel.aggregate([
      { $match: { ...match, status: 'paid', payDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$payDate' }, month: { $month: '$payDate' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Site progress list
    const siteProgress = sites.map(s => ({
      _id: s._id,
      siteCode: s.siteCode,
      name: s.name,
      location: s.location,
      status: s.status,
      progress: s.progress,
      budget: s.budget,
      engineerName: s.engineerName,
      workerCount: s.workerCount,
    }));

    // Recent payments
    const recentPayments = await ConstructionPaymentModel.find(match)
      .sort({ createdAt: -1 }).limit(8).lean();

    res.json({
      success: true,
      stats: {
        totalSites: siteCount,
        activeSites,
        totalEngineers: engineerCount,
        totalWorkers: workerCount,
        activeWorkers,
        totalMaterials: materialCount,
        totalSuppliers: supplierCount,
        totalBudget,
        totalSpent,
        budgetRemaining: Math.max(0, totalBudget - totalSpent),
        budgetPercentUsed: totalBudget > 0 ? Math.round(((totalBudget - totalSpent) / totalBudget) * 100) : 0,
        pendingPayments,
        paymentStatusBreakdown,
      },
      monthlyExpenditure,
      siteProgress,
      recentPayments,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SITES
// ============================================================================
router.get('/sites', async (req: Request & { user?: any }, res: Response) => {
  try {
const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = isAdministrator ? {} : { ownedBy: owner };
    const { status, search } = req.query;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { siteCode: { $regex: search, $options: 'i' } }
      ];
    }
    const sites = await ConstructionSiteModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, sites });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const site = await ConstructionSiteModel.findOne(filter).lean();
    if (!site) return res.status(404).json({ error: 'Site not found' });
    res.json({ success: true, site });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sites', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const body = req.body;

    // If engineer assigned, set engineerName
    let engineerName = body.engineerName;
    if (body.engineer) {
      const eng = await ConstructionEngineerModel.findById(body.engineer);
      if (eng) {
        engineerName = `${eng.firstName} ${eng.lastName}`;
        // push site to engineer assignedSites
        if (!eng.assignedSites.includes(body.engineer)) {
          eng.assignedSites.push(body.engineer);
          await eng.save();
        }
      }
    }

    const site = new ConstructionSiteModel({
      ...body,
      engineerName,
      ownedBy: owner,
      createdBy: owner,
      budget: {
        total: body.budget?.total || body.totalBudget || 0,
        spent: body.budget?.spent || body.amountSpent || 0,
      }
    });
    await site.save();
    res.status(201).json({ success: true, site });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;

    const body = req.body;
    if (body.engineer) {
      const eng = await ConstructionEngineerModel.findById(body.engineer);
      if (eng) body.engineerName = `${eng.firstName} ${eng.lastName}`;
    }
    if (body.budget) {
      body.budget = {
        total: body.budget.total,
        spent: body.budget.spent,
        remaining: Math.max(0, (body.budget.total || 0) - (body.budget.spent || 0))
      };
    }

    const site = await ConstructionSiteModel.findOneAndUpdate(filter, body, { new: true, runValidators: true });
    if (!site) return res.status(404).json({ error: 'Site not found' });
    res.json({ success: true, site });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const site = await ConstructionSiteModel.findOneAndDelete(filter);
    if (!site) return res.status(404).json({ error: 'Site not found' });
    res.json({ success: true, message: 'Site deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ENGINEERS
// ============================================================================
router.get('/engineers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter = isAdministrator ? {} : { ownedBy: owner };
    const engineers = await ConstructionEngineerModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, engineers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/engineers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const { user: linkedUserId, ...rest } = req.body;
    const engineer = new ConstructionEngineerModel({
      ...rest,
      status: rest.status || 'active',
      specialty: rest.specialty || 'Civil Engineering',
      monthlySalary: Number(rest.monthlySalary || 0),
      experienceYears: Number(rest.experienceYears || 0),
      ownedBy: owner,
      createdBy: owner,
    });
    await engineer.save();

    // Link user account to engineer profile
    if (linkedUserId) {
      await UserModel.findByIdAndUpdate(linkedUserId, {
        engineerProfile: engineer._id,
        ...(rest.role === 'engineer' ? { role: 'engineer' } : {})
      });
      engineer.user = linkedUserId;
      await engineer.save();
    }
    res.status(201).json({ success: true, engineer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/engineers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const engineer = await ConstructionEngineerModel.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!engineer) return res.status(404).json({ error: 'Engineer not found' });
    res.json({ success: true, engineer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/engineers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const engineer = await ConstructionEngineerModel.findOneAndDelete(filter);
    if (!engineer) return res.status(404).json({ error: 'Engineer not found' });
    res.json({ success: true, message: 'Engineer deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// WORKERS
// ============================================================================
router.get('/workers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = isAdministrator ? {} : { ownedBy: owner };
    const { site, role, status, search } = req.query;
    if (site) filter.site = site;
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { workerCode: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    const workers = await ConstructionWorkerModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, workers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/workers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const body = req.body;
    let siteName = body.siteName;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site);
      if (site) {
        siteName = site.name;
        site.workerCount = (site.workerCount || 0) + 1;
        await site.save();
      }
    }
    const worker = new ConstructionWorkerModel({
      ...body,
      siteName,
      ownedBy: owner,
      createdBy: owner,
    });
    await worker.save();
    res.status(201).json({ success: true, worker });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/workers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const body = req.body;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site);
      if (site) body.siteName = site.name;
    }
    const worker = await ConstructionWorkerModel.findOneAndUpdate(filter, body, { new: true, runValidators: true });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/workers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const worker = await ConstructionWorkerModel.findOneAndDelete(filter);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json({ success: true, message: 'Worker deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ATTENDANCE
// ============================================================================
router.get('/attendance', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = isAdministrator ? {} : { ownedBy: owner };
    const { site, date, worker } = req.query;
    if (site) filter.site = site;
    if (worker) filter.worker = worker;
    if (date) {
      const d = new Date(date as string);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    const records = await AttendanceRecordModel.find(filter).sort({ date: -1 }).limit(500).lean();
    res.json({ success: true, records });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance for a worker (upsert per day)
router.post('/attendance', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const { worker, date, status, note, site, siteName, checkIn, checkOut } = req.body;

    const workerDoc = await ConstructionWorkerModel.findById(worker);
    if (!workerDoc) return res.status(404).json({ error: 'Worker not found' });

    const d = new Date(date || Date.now());
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);

    const record = await AttendanceRecordModel.findOneAndUpdate(
      { worker, date: { $gte: start, $lte: end }, ownedBy: owner },
      {
        worker,
        workerName: `${workerDoc.firstName} ${workerDoc.lastName}`,
        site: site || workerDoc.site,
        siteName: siteName || workerDoc.siteName,
        date: d,
        status,
        note,
        checkIn,
        checkOut,
        recordedBy: owner,
        ownedBy: owner,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recompute attendance rate for worker (last 30 days)
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const total = await AttendanceRecordModel.countDocuments({ worker, ownedBy: owner, date: { $gte: thirtyDaysAgo } });
    const present = await AttendanceRecordModel.countDocuments({ worker, ownedBy: owner, date: { $gte: thirtyDaysAgo }, status: { $in: ['present', 'late'] } });
    workerDoc.attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    workerDoc.daysWorked = total;
    await workerDoc.save();

    res.status(201).json({ success: true, record });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// PAYMENTS
// ============================================================================
router.get('/payments', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = isAdministrator ? {} : { ownedBy: owner };
    const { status, type, site, search } = req.query;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (site) filter.site = site;
    if (search) {
      filter.$or = [
        { recipientName: { $regex: search, $options: 'i' } },
        { paymentRef: { $regex: search, $options: 'i' } }
      ];
    }
    const payments = await ConstructionPaymentModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, payments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payments', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const body = req.body;
    let siteName = body.siteName;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site);
      if (site) siteName = site.name;
    }

    // If marking worker payment, update worker totalEarned
    if (body.recipientType === 'worker' && body.recipient && body.status === 'paid') {
      const worker = await ConstructionWorkerModel.findById(body.recipient);
      if (worker) {
        worker.totalEarned = (worker.totalEarned || 0) + (body.amount || 0);
        await worker.save();
      }
    }

    const payment = new ConstructionPaymentModel({
      ...body,
      siteName,
      ownedBy: owner,
      recordedBy: owner,
    });
    await payment.save();
    res.status(201).json({ success: true, payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/payments/:id/status', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const payment = await ConstructionPaymentModel.findOneAndUpdate(filter, { status: req.body.status, payDate: req.body.status === 'paid' ? new Date() : undefined }, { new: true, runValidators: true });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ success: true, payment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/payments/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const payment = await ConstructionPaymentModel.findOneAndDelete(filter);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// MATERIALS
// ============================================================================
router.get('/materials', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = isAdministrator ? {} : { ownedBy: owner };
    const { site, status, category, search } = req.query;
    if (site) filter.site = site;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { materialCode: { $regex: search, $options: 'i' } }
      ];
    }
    const materials = await ConstructionMaterialModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, materials });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/materials', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const body = req.body;
    let siteName = body.siteName;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site);
      if (site) siteName = site.name;
    }
    const material = new ConstructionMaterialModel({
      ...body,
      siteName,
      ownedBy: owner,
      createdBy: owner,
    });
    await material.save();
    res.status(201).json({ success: true, material });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/materials/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const body = req.body;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site);
      if (site) body.siteName = site.name;
    }
    const material = await ConstructionMaterialModel.findOneAndUpdate(filter, body, { new: true, runValidators: true });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json({ success: true, material });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/materials/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const material = await ConstructionMaterialModel.findOneAndDelete(filter);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json({ success: true, message: 'Material deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SUPPLIERS
// ============================================================================
router.get('/suppliers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = isAdministrator ? {} : { ownedBy: owner };
    const suppliers = await ConstructionSupplierModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, suppliers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/suppliers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const supplier = new ConstructionSupplierModel({
      ...req.body,
      ownedBy: owner,
      createdBy: owner,
    });
    await supplier.save();
    res.status(201).json({ success: true, supplier });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/suppliers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const supplier = await ConstructionSupplierModel.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ success: true, supplier });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/suppliers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const supplier = await ConstructionSupplierModel.findOneAndDelete(filter);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// QUOTATIONS & INVOICES (per-engineer company branding)
// ============================================================================
// Get or create engineer settings
router.get('/settings', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    let settings = await EngineerSettingsModel.findOne({ ownedBy: owner });
    if (!settings) {
      settings = new EngineerSettingsModel({ ownedBy: owner, currency: 'KES' });
      await settings.save();
    } else if (!settings.currency) {
      settings.currency = 'KES';
      await settings.save();
    }
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    let settings = await EngineerSettingsModel.findOne({ ownedBy: owner });
    const nextSettings = { ...req.body, ownedBy: owner, currency: req.body.currency || 'KES' };
    if (!settings) {
      settings = new EngineerSettingsModel(nextSettings);
    } else {
      Object.assign(settings, nextSettings);
    }
    await settings.save();
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List quotes/invoices
router.get('/quotes', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = isAdministrator ? {} : { ownedBy: owner };
    const { type } = req.query;
    if (type) filter.type = type;
    const quotes = await ConstructionQuoteModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, quotes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/quotes/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;

    const quote = await ConstructionQuoteModel.findOne(filter);
    if (!quote) return res.status(404).json({ error: 'Document not found' });

    const sanitizedBody = { ...req.body };
    if (sanitizedBody.items && Array.isArray(sanitizedBody.items)) {
      sanitizedBody.items = sanitizedBody.items.map((item: any) => ({
        ...item,
        description: item.description ?? '',
        total: Number(item.qty || 0) * Number(item.price || 0),
      }));
    }

    Object.assign(quote, sanitizedBody);
    await quote.save();
    res.json({ success: true, quote });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/quotes', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const body = req.body;
    const settings = await EngineerSettingsModel.findOne({ ownedBy: owner });
    const prefix = body.type === 'invoice' ? (settings?.invoicePrefix || 'BC-INV') : (settings?.quotePrefix || 'BC-Q');
    const engineer = body.engineer || (await ConstructionEngineerModel.findOne({ ownedBy: owner }))?._id;
    const docNumber = await generateConstructionDocNumber(body.type || 'quotation', engineer?.toString() || owner, prefix);
    const quote = new ConstructionQuoteModel({
      ...body,
      docNumber,
      engineer: engineer,
      ownedBy: owner,
    });
    await quote.save();
    res.status(201).json({ success: true, quote });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/quotes/:id/status', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const quote = await ConstructionQuoteModel.findOneAndUpdate(filter, { status: req.body.status }, { new: true, runValidators: true });
    if (!quote) return res.status(404).json({ error: 'Document not found' });
    res.json({ success: true, quote });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/quotes/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const owner = ownedBy(req);
    const isAdministrator = isAdmin(req);
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.ownedBy = owner;
    const quote = await ConstructionQuoteModel.findOneAndDelete(filter);
    if (!quote) return res.status(404).json({ error: 'Document not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
