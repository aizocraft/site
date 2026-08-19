import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import mongoose from 'mongoose';

// Use consistent model imports
import ConstructionSiteModel from '../models/ConstructionSite';
import EngineerModel from '../models/Engineer';
import WorkerModel from '../models/Worker';
import MaterialModel from '../models/Material';
import AttendanceModel from '../models/Attendance';
import PaymentRecordModel from '../models/PaymentRecord';
import ConstructionSupplierModel from '../models/ConstructionSupplier';
import UserModel from '../models/User';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Helper functions
const getUserId = (req: Request & { user?: any }) => req.user?.userId;
const isAdmin = (req: Request & { user?: any }) => req.user?.role === 'admin';
const isEngineer = (req: Request & { user?: any }) => req.user?.role === 'engineer';

// Get access filter based on role
const getAccessFilter = (req: Request & { user?: any }, extraFilter: Record<string, any> = {}) => {
  const userId = getUserId(req);
  
  // Admin sees everything
  if (isAdmin(req)) {
    return extraFilter;
  }
  
  // Engineer sees their assigned sites and related data
  if (isEngineer(req)) {
    // Get engineer profile
    // For demo, we filter by createdBy - but ideally should check assigned sites
    return { ...extraFilter, createdBy: userId };
  }
  
  // Regular user sees only their own data
  return { ...extraFilter, createdBy: userId };
};

// Helper: Generate sequential codes with proper prefix
const generateCode = async (prefix: string, Model: any, fieldName: string = 'code'): Promise<string> => {
  const last = await Model.findOne().sort({ createdAt: -1 }).lean();
  let lastNum = 100;
  
  if (last) {
    const lastCode = last[fieldName] || '';
    const numMatch = lastCode.match(/\d+/);
    if (numMatch) {
      lastNum = parseInt(numMatch[0], 10);
    }
  }
  
  return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
};

// ============================================================
// DASHBOARD OVERVIEW
// ============================================================
router.get('/overview', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const isEngineerUser = isEngineer(req);
    
    // Build filter based on role
    let filter: any = {};
    if (!isAdministrator) {
      filter.createdBy = userId;
    }
    
    // If engineer, also include sites assigned to them
    let engineerSites: string[] = [];
    if (isEngineerUser) {
      const engineer = await EngineerModel.findOne({ 
        createdBy: userId,
        status: 'active' 
      }).lean();
      if (engineer && engineer.assignedSite) {
        engineerSites.push(engineer.assignedSite.toString());
      }
    }
    
    // Fetch all data with proper filters
    const [sites, workers, engineers, materials, payments, suppliers] = await Promise.all([
      ConstructionSiteModel.find(filter).lean(),
      WorkerModel.find(filter).lean(),
      EngineerModel.find(filter).lean(),
      MaterialModel.find(filter).lean(),
      PaymentRecordModel.find(filter).lean(),
      ConstructionSupplierModel.find(filter).lean(),
    ]);
    
    // If engineer, filter sites to only assigned ones
    const filteredSites = isEngineerUser && engineerSites.length > 0
      ? sites.filter(s => engineerSites.includes(s._id.toString()))
      : sites;
    
    const activeSites = filteredSites.filter(s => s.status === 'active');
    const totalBudget = filteredSites.reduce((sum, s) => sum + Number(s.budget?.total || 0), 0);
    const totalSpent = filteredSites.reduce((sum, s) => sum + Number(s.budget?.spent || 0), 0);
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
          totalSites: filteredSites.length,
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
        sites: filteredSites,
        workers,
        payments,
        materials,
        role: req.user?.role,
      },
    });
  } catch (error: any) {
    console.error('Overview error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// SITES
// ============================================================
router.get('/sites', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const { status, search } = req.query;
    
    const filter: any = isAdministrator ? {} : { createdBy: userId };
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { siteCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sites = await ConstructionSiteModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ success: true, sites });
  } catch (error: any) {
    console.error('Sites fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const site = await ConstructionSiteModel.findOne(filter).lean();
    if (!site) {
      return res.status(404).json({ success: false, error: 'Site not found' });
    }
    
    res.json({ success: true, site });
  } catch (error: any) {
    console.error('Site fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/sites', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const body = req.body;
    
    // Generate site code
    const siteCode = await generateCode('S', ConstructionSiteModel, 'siteCode');
    
    // If engineer assigned, get engineer name
    let engineerName = body.engineerName;
    if (body.engineer) {
      const engineer = await EngineerModel.findById(body.engineer).lean();
      if (engineer) {
        engineerName = `${engineer.firstName} ${engineer.lastName}`;
        // Update engineer's assigned site
        await EngineerModel.findByIdAndUpdate(body.engineer, {
          assignedSite: body.engineer,
          assignedSiteName: body.name,
          status: 'active'
        });
      }
    }
    
    const site = new ConstructionSiteModel({
      ...body,
      siteCode,
      engineerName,
      createdBy: userId,
      budget: {
        total: body.budget?.total || 0,
        spent: body.budget?.spent || 0,
        remaining: (body.budget?.total || 0) - (body.budget?.spent || 0),
      }
    });
    
    await site.save();
    res.status(201).json({ success: true, site });
  } catch (error: any) {
    console.error('Site creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const body = req.body;
    
    // If engineer changed, update engineer's assigned site
    if (body.engineer) {
      const engineer = await EngineerModel.findById(body.engineer).lean();
      if (engineer) {
        body.engineerName = `${engineer.firstName} ${engineer.lastName}`;
      }
    }
    
    // Update budget calculation
    if (body.budget) {
      body.budget.remaining = Math.max(0, (body.budget.total || 0) - (body.budget.spent || 0));
    }
    
    const site = await ConstructionSiteModel.findOneAndUpdate(
      filter,
      body,
      { new: true, runValidators: true }
    );
    
    if (!site) {
      return res.status(404).json({ success: false, error: 'Site not found' });
    }
    
    res.json({ success: true, site });
  } catch (error: any) {
    console.error('Site update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/sites/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const site = await ConstructionSiteModel.findOneAndDelete(filter);
    if (!site) {
      return res.status(404).json({ success: false, error: 'Site not found' });
    }
    
    // Unassign engineers and workers
    await EngineerModel.updateMany(
      { assignedSite: req.params.id },
      { assignedSite: undefined, assignedSiteName: undefined }
    );
    await WorkerModel.updateMany(
      { site: req.params.id },
      { site: undefined, siteName: undefined }
    );
    
    res.json({ success: true, message: 'Site deleted' });
  } catch (error: any) {
    console.error('Site deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// ENGINEERS
// ============================================================
router.get('/engineers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const { search } = req.query;
    
    const filter: any = isAdministrator ? {} : { createdBy: userId };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { engineerCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    const engineers = await EngineerModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ success: true, engineers });
  } catch (error: any) {
    console.error('Engineers fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/engineers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const body = req.body;
    
    // Generate engineer code
    const engineerCode = await generateCode('E', EngineerModel, 'engineerCode');
    
    // Check if email already exists
    const existing = await EngineerModel.findOne({ email: body.email });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'Engineer with this email already exists' 
      });
    }
    
    // Handle user account creation/linking
    let linkedUserId = body.linkedUserId;
    if (body.createUserAccount) {
      // Create a user account for this engineer
      const tempPassword = Math.random().toString(36).slice(-8);
      const UserModel = mongoose.model('User');
      
      const newUser = new UserModel({
        email: body.email,
        password: tempPassword, // Should be hashed by pre-save hook
        firstName: body.firstName,
        lastName: body.lastName,
        role: 'engineer',
        isActive: true,
        requiresPasswordChange: true,
      });
      
      await newUser.save();
      linkedUserId = newUser._id;
      
      // In a real app, send email with password
      console.log(`Engineer account created for ${body.email} with temp password: ${tempPassword}`);
    }
    
    const engineer = new EngineerModel({
      ...body,
      engineerCode,
      createdBy: userId,
      user: linkedUserId,
    });
    
    await engineer.save();
    
    // If assigned site, update site with engineer info
    if (engineer.assignedSite) {
      await ConstructionSiteModel.findByIdAndUpdate(engineer.assignedSite, {
        engineer: engineer._id,
        engineerName: `${engineer.firstName} ${engineer.lastName}`
      });
    }
    
    res.status(201).json({ 
      success: true, 
      engineer,
      message: linkedUserId ? 'Engineer created with user account' : 'Engineer created'
    });
  } catch (error: any) {
    console.error('Engineer creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/engineers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const body = req.body;
    
    const engineer = await EngineerModel.findOneAndUpdate(
      filter,
      body,
      { new: true, runValidators: true }
    );
    
    if (!engineer) {
      return res.status(404).json({ success: false, error: 'Engineer not found' });
    }
    
    // Update site if assigned
    if (engineer.assignedSite) {
      await ConstructionSiteModel.findByIdAndUpdate(engineer.assignedSite, {
        engineer: engineer._id,
        engineerName: `${engineer.firstName} ${engineer.lastName}`
      });
    }
    
    res.json({ success: true, engineer });
  } catch (error: any) {
    console.error('Engineer update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/engineers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const engineer = await EngineerModel.findOneAndDelete(filter);
    if (!engineer) {
      return res.status(404).json({ success: false, error: 'Engineer not found' });
    }
    
    // Remove from site
    if (engineer.assignedSite) {
      await ConstructionSiteModel.findByIdAndUpdate(engineer.assignedSite, {
        engineer: undefined,
        engineerName: undefined
      });
    }
    
    res.json({ success: true, message: 'Engineer deleted' });
  } catch (error: any) {
    console.error('Engineer deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// WORKERS
// ============================================================
router.get('/workers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const { status, search, site } = req.query;
    
    const filter: any = isAdministrator ? {} : { createdBy: userId };
    if (status && status !== 'all') filter.status = status;
    if (site && site !== 'all') filter.site = site;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { workerCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    const workers = await WorkerModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ success: true, workers });
  } catch (error: any) {
    console.error('Workers fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/workers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const body = req.body;
    
    const workerCode = await generateCode('W', WorkerModel, 'workerCode');
    
    // Get site name if site provided
    let siteName = body.siteName;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site).lean();
      if (site) {
        siteName = site.name;
        // Update site worker count
        await ConstructionSiteModel.findByIdAndUpdate(body.site, {
          $inc: { workerCount: 1 }
        });
      }
    }
    
    const worker = new WorkerModel({
      ...body,
      workerCode,
      siteName,
      createdBy: userId,
    });
    
    await worker.save();
    res.status(201).json({ success: true, worker });
  } catch (error: any) {
    console.error('Worker creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/workers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const body = req.body;
    
    // Update site name if site changed
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site).lean();
      if (site) body.siteName = site.name;
    }
    
    const worker = await WorkerModel.findOneAndUpdate(
      filter,
      body,
      { new: true, runValidators: true }
    );
    
    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker not found' });
    }
    
    res.json({ success: true, worker });
  } catch (error: any) {
    console.error('Worker update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/workers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const worker = await WorkerModel.findOneAndDelete(filter);
    if (!worker) {
      return res.status(404).json({ success: false, error: 'Worker not found' });
    }
    
    // Update site worker count
    if (worker.site) {
      await ConstructionSiteModel.findByIdAndUpdate(worker.site, {
        $inc: { workerCount: -1 }
      });
    }
    
    res.json({ success: true, message: 'Worker deleted' });
  } catch (error: any) {
    console.error('Worker deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// MATERIALS
// ============================================================
router.get('/materials', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const { site, status, search } = req.query;
    
    const filter: any = isAdministrator ? {} : { createdBy: userId };
    if (site && site !== 'all') filter.site = site;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { materialCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    const materials = await MaterialModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ success: true, materials });
  } catch (error: any) {
    console.error('Materials fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/materials', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const body = req.body;
    
    const materialCode = await generateCode('M', MaterialModel, 'materialCode');
    
    // Get site name if site provided
    let siteName = body.siteName;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site).lean();
      if (site) siteName = site.name;
    }
    
    const totalValue = (body.stock || 0) * (body.unitCost || 0);
    
    // Compute status based on stock vs reorder level
    let status = 'in_stock';
    if (body.stock <= 0) status = 'out_of_stock';
    else if (body.stock <= body.reorderLevel) status = 'low_stock';
    
    const material = new MaterialModel({
      ...body,
      materialCode,
      siteName,
      totalValue,
      status,
      createdBy: userId,
    });
    
    await material.save();
    res.status(201).json({ success: true, material });
  } catch (error: any) {
    console.error('Material creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/materials/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const existing = await MaterialModel.findOne(filter);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Material not found' });
    }
    
    const body = req.body;
    const stock = body.stock !== undefined ? body.stock : existing.stock;
    const unitCost = body.unitCost !== undefined ? body.unitCost : existing.unitCost;
    const reorderLevel = body.reorderLevel !== undefined ? body.reorderLevel : existing.reorderLevel;
    
    // Compute status
    let status = 'in_stock';
    if (stock <= 0) status = 'out_of_stock';
    else if (stock <= reorderLevel) status = 'low_stock';
    
    const material = await MaterialModel.findOneAndUpdate(
      filter,
      {
        ...body,
        totalValue: stock * unitCost,
        status,
      },
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, material });
  } catch (error: any) {
    console.error('Material update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/materials/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const material = await MaterialModel.findOneAndDelete(filter);
    if (!material) {
      return res.status(404).json({ success: false, error: 'Material not found' });
    }
    
    res.json({ success: true, message: 'Material deleted' });
  } catch (error: any) {
    console.error('Material deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// ATTENDANCE
// ============================================================
router.get('/attendance', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const { site, date, worker, status } = req.query;
    
    const filter: any = isAdministrator ? {} : { createdBy: userId };
    if (site && site !== 'all') filter.site = site;
    if (worker && worker !== 'all') filter.worker = worker;
    if (status && status !== 'all') filter.status = status;
    
    if (date) {
      const d = new Date(date as string);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    
    const records = await AttendanceModel.find(filter)
      .sort({ date: -1 })
      .limit(500)
      .lean();
    
    res.json({ success: true, attendance: records });
  } catch (error: any) {
    console.error('Attendance fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/attendance', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const { worker, date, status, hoursWorked, note } = req.body;
    
    // Get worker details
    const workerData = await WorkerModel.findById(worker);
    if (!workerData) {
      return res.status(404).json({ success: false, error: 'Worker not found' });
    }
    
    const d = new Date(date || Date.now());
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    
    // Calculate hours worked based on status
    let calculatedHours = hoursWorked;
    if (calculatedHours === undefined) {
      if (status === 'present') calculatedHours = 8;
      else if (status === 'half_day') calculatedHours = 4;
      else if (status === 'overtime') calculatedHours = 10;
      else calculatedHours = 0;
    }
    
    // Upsert attendance record
    const record = await AttendanceModel.findOneAndUpdate(
      { worker, date: { $gte: start, $lte: end } },
      {
        worker,
        workerName: `${workerData.firstName} ${workerData.lastName}`,
        site: workerData.site,
        siteName: workerData.siteName,
        date: d,
        status,
        hoursWorked: calculatedHours,
        note,
        createdBy: userId,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    // Update worker attendance rate
    const total = await AttendanceModel.countDocuments({ worker });
    const present = await AttendanceModel.countDocuments({ 
      worker, 
      status: { $in: ['present', 'late'] } 
    });
    const halfDay = await AttendanceModel.countDocuments({ 
      worker, 
      status: 'half_day' 
    });
    const rate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 100;
    
    await WorkerModel.findByIdAndUpdate(worker, { 
      attendanceRate: rate,
      daysWorked: total 
    });
    
    res.status(201).json({ success: true, attendance: record });
  } catch (error: any) {
    console.error('Attendance creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// PAYMENTS
// ============================================================
router.get('/payments', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const { status, recipientType, search } = req.query;
    
    const filter: any = isAdministrator ? {} : { createdBy: userId };
    if (status && status !== 'all') filter.status = status;
    if (recipientType && recipientType !== 'all') filter.recipientType = recipientType;
    if (search) {
      filter.$or = [
        { recipientName: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }
    
    const payments = await PaymentRecordModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    
    res.json({ success: true, payments });
  } catch (error: any) {
    console.error('Payments fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/payments', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const body = req.body;
    
    // Generate payment reference
    const reference = `PYM-${Date.now().toString().slice(-6)}`;
    
    // Get site name if site provided
    let siteName = body.siteName;
    if (body.site) {
      const site = await ConstructionSiteModel.findById(body.site).lean();
      if (site) siteName = site.name;
    }
    
    const payment = new PaymentRecordModel({
      ...body,
      reference,
      siteName,
      createdBy: userId,
    });
    
    await payment.save();
    
    // Update worker total earned if payment is for worker and is paid
    if (payment.recipientType === 'worker' && payment.recipient && payment.status === 'paid') {
      await WorkerModel.findByIdAndUpdate(payment.recipient, {
        $inc: { totalEarned: payment.amount }
      });
    }
    
    // Update site budget spent
    if (payment.site && payment.status === 'paid') {
      await ConstructionSiteModel.findByIdAndUpdate(payment.site, {
        $inc: { 'budget.spent': payment.amount }
      });
    }
    
    res.status(201).json({ success: true, payment });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/payments/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const existing = await PaymentRecordModel.findOne(filter);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    
    const body = req.body;
    const payment = await PaymentRecordModel.findOneAndUpdate(
      filter,
      body,
      { new: true, runValidators: true }
    );
    
    // Adjust worker totalEarned if status or amount changed
    if (payment && payment.recipientType === 'worker' && payment.recipient) {
      const wasPaid = existing.status === 'paid';
      const isPaid = payment.status === 'paid';
      
      if (wasPaid && !isPaid) {
        await WorkerModel.findByIdAndUpdate(payment.recipient, {
          $inc: { totalEarned: -existing.amount }
        });
      } else if (!wasPaid && isPaid) {
        await WorkerModel.findByIdAndUpdate(payment.recipient, {
          $inc: { totalEarned: payment.amount }
        });
      } else if (wasPaid && isPaid && existing.amount !== payment.amount) {
        await WorkerModel.findByIdAndUpdate(payment.recipient, {
          $inc: { totalEarned: payment.amount - existing.amount }
        });
      }
    }
    
    res.json({ success: true, payment });
  } catch (error: any) {
    console.error('Payment update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/payments/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const payment = await PaymentRecordModel.findOneAndDelete(filter);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    
    // Reverse worker earnings
    if (payment.recipientType === 'worker' && payment.recipient && payment.status === 'paid') {
      await WorkerModel.findByIdAndUpdate(payment.recipient, {
        $inc: { totalEarned: -payment.amount }
      });
    }
    
    // Reverse site budget
    if (payment.site && payment.status === 'paid') {
      await ConstructionSiteModel.findByIdAndUpdate(payment.site, {
        $inc: { 'budget.spent': -payment.amount }
      });
    }
    
    res.json({ success: true, message: 'Payment deleted' });
  } catch (error: any) {
    console.error('Payment deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// SUPPLIERS
// ============================================================
router.get('/suppliers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    const { search } = req.query;
    
    const filter: any = isAdministrator ? {} : { createdBy: userId };
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const suppliers = await ConstructionSupplierModel.find(filter)
      .sort({ companyName: 1 })
      .lean();
    
    res.json({ success: true, suppliers });
  } catch (error: any) {
    console.error('Suppliers fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/suppliers', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    
    const supplier = new ConstructionSupplierModel({
      ...req.body,
      createdBy: userId,
    });
    
    await supplier.save();
    res.status(201).json({ success: true, supplier });
  } catch (error: any) {
    console.error('Supplier creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/suppliers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const supplier = await ConstructionSupplierModel.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    
    res.json({ success: true, supplier });
  } catch (error: any) {
    console.error('Supplier update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/suppliers/:id', async (req: Request & { user?: any }, res: Response) => {
  try {
    const userId = getUserId(req);
    const isAdministrator = isAdmin(req);
    
    const filter: any = { _id: req.params.id };
    if (!isAdministrator) filter.createdBy = userId;
    
    const supplier = await ConstructionSupplierModel.findOneAndDelete(filter);
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error: any) {
    console.error('Supplier deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;