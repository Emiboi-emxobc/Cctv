// server.js - Nexa unified single-file backend
// npm i express mongoose cors axios bcrypt jsonwebtoken dotenv multer fs-extra

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads folder
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.ensureDirSync(UPLOAD_DIR);

// multer for single-file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const suf = Date.now() + '-' + Math.floor(Math.random() * 9999);
    cb(null, suf + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// Config / env
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://echukwuemeka947_db_user:r3zqS3JjEU9gXvNB@nexa.umbtm8q.mongodb.net/nexa?retryWrites=true&w=majority&appName=Nexa';
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'supersecretkeywiththiskeyyoucaneasilyenter';
const BASE_URL = process.env.BASE_URL || 'https://nexa.vercel.app';
const LIVE_NOTIFICATIONS =
  process.env.LIVE_NOTIFICATIONS === 'true' ||
  process.env.LIVE_NOTIFICATIONS === '1';

// Helper: log
function info(...args) {
  console.log('[nexa]', ...args);
}
function error(...args) {
  console.error('[nexa]', ...args);
}

// -------------------- Mongo --------------------
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => info('Mongo connected'))
  .catch((err) => error('Mongo error:', err.message));

// -------------------- Schemas --------------------
const AdminSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  phone: { type: String },
  apikey: { type: String },
  email: String,
  password: { type: String, required: true },
  settings: {
    requireSecurityCode: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
  },
  subscriptionExpiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});
const Admin = mongoose.model('Admin', AdminSchema);

const StudentSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, sparse: true },
  password: String,
  email: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  referralCode: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Student = mongoose.model('Student', StudentSchema);

const MaterialSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  title: String,
  content: String,
  file: String,
  createdAt: { type: Date, default: Date.now },
});
const Material = mongoose.model('Material', MaterialSchema);

const ActivitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  action: String,
  details: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});
const Activity = mongoose.model('Activity', ActivitySchema);

const ReferralSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  code: { type: String, unique: true },
  link: String,
  visits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Referral = mongoose.model('Referral', ReferralSchema);

const VisitSchema = new mongoose.Schema({
  path: String,
  refCode: String,
  refAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  ip: String,
  ua: String,
  utm: Object,
  createdAt: { type: Date, default: Date.now },
});
const Visit = mongoose.model('Visit', VisitSchema);

const SecurityCodeSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  code: { type: Number },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const SecurityCode = mongoose.model('SecurityCode', SecurityCodeSchema);

const SubscriptionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userType: { type: String, enum: ['admin', 'student'], default: 'admin' },
  plan: String,
  startedAt: Date,
  expiresAt: Date,
  active: { type: Boolean, default: true },
});
const Subscription = mongoose.model('Subscription', SubscriptionSchema);

// ---------- Student login
app.post('/student/login', async (req,res) => {
  try{
    const { username, password, securityCode } = req.body;
    if (!username || !password) return res.status(400).json({ error:'username & password required' });
    const student = await Student.findOne({ username });
    if (!student) return res.status(400).json({ error:'Invalid credentials' });
    const ok = await cmpPw(password, student.password);
    if (!ok) return res.status(400).json({ error:'Invalid credentials' });

    const admin = await Admin.findById(student.adminId);
    if (admin && admin.settings.requireSecurityCode) {
      if (!securityCode) return res.status(400).json({ error: 'Security code required' });
      const codeDoc = await SecurityCode.findOne({ adminId: admin._id, code: Number(securityCode), usedBy: student._id });
      if (!codeDoc) return res.status(400).json({ error: 'Invalid or mismatched security code' });
    }

    await Activity.create({ adminId: student.adminId, studentId: student._id, action:'login', details:{ username } });

    const token = createToken({ id: student._id, role:'student' });
    const msg = `👨‍🎓 Student logged in: ${username}`;
    if (admin && admin.phone && admin.apikey) await sendWhatsApp(admin.phone, msg, admin.apikey);
    else await notifyAdminGlobal(msg);

    res.json({ success:true, student:{ id: student._id, username: student.username, verified: student.verified }, token });
  }catch(err){ error('student login', err.message); res.status(500).json({ error:'Login failed' }); }
});

// ---------- Visit logging
app.post('/api/visit/log', async (req,res) => {
  try {
    const { path, referrer, utm, userAgent } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let refAdminId = null;
    if (referrer && referrer !== 'direct') {
      const refDoc = await Referral.findOne({ code: referrer });
      if (refDoc) {
        refDoc.visits = (refDoc.visits || 0) + 1;
        await refDoc.save();
        refAdminId = refDoc.adminId;
      }
    }
    await Visit.create({ path, refCode: referrer, refAdminId, ip, ua: userAgent, utm });
    if (refAdminId) {
      await notifyTeacherByAdminId(refAdminId, `👀 Visit detected on ${path}\nRef: ${referrer}`);
    }
    res.json({ success:true, visitLogged:true });
  } catch (err) {
    error('visit log', err.message);
    res.status(500).json({ error:'Visit logging failed' });
  }
});

// ---------- Subscription expiry cleanup
async function checkExpiredSubs() {
  try {
    const now = new Date();
    const expired = await Subscription.find({ expiresAt: { $lte: now }, active: true });
    for (const sub of expired) {
      sub.active = false;
      await sub.save();
      if (sub.userType === 'admin') {
        const admin = await Admin.findById(sub.userId);
        if (admin) {
          admin.phone = null;
          admin.apikey = null;
          await admin.save();
          await notifyAdminGlobal(`Subscription expired for teacher ${admin.username}, credentials removed`);
        }
      }
    }
  } catch (err) {
    error('checkExpiredSubs', err.message);
  }
}
setInterval(checkExpiredSubs, 1000 * 60 * 10); // every 10 minutes

// ---------- Material list (for teacher dashboard)
app.get('/teacher/materials', authAdmin, async (req,res) => {
  try {
    const list = await Material.find({ adminId: req.admin._id }).sort({ createdAt: -1 });
    res.json({ success:true, materials: list });
  } catch (err) {
    error('materials list', err.message);
    res.status(500).json({ error:'Failed' });
  }
});

// ---------- Students under teacher
app.get('/teacher/students', authAdmin, async (req,res) => {
  try {
    const students = await Student.find({ adminId: req.admin._id }).sort({ createdAt: -1 });
    res.json({ success:true, students });
  } catch (err) {
    error('teacher students', err.message);
    res.status(500).json({ error:'Failed' });
  }
});

// ---------- Activate or deactivate security code
app.post('/teacher/security/toggle', authAdmin, async (req,res) => {
  try {
    const { active } = req.body;
    req.admin.settings.requireSecurityCode = !!active;
    await req.admin.save();
    res.json({ success:true, requireSecurityCode: req.admin.settings.requireSecurityCode });
  } catch (err) {
    error('toggle security', err.message);
    res.status(500).json({ error:'Failed' });
  }
});

// ---------- Generate a new security code
app.post('/teacher/security/generate', authAdmin, async (req,res) => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000);
    const doc = await SecurityCode.create({ adminId: req.admin._id, code });
    res.json({ success:true, code });
  } catch (err) {
    error('generate code', err.message);
    res.status(500).json({ error:'Failed' });
  }
});

// ---------- View student activities (teacher)
app.get('/teacher/activities', authAdmin, async (req,res) => {
  try {
    const acts = await Activity.find({ adminId: req.admin._id }).sort({ createdAt: -1 }).limit(100);
    res.json({ success:true, activities: acts });
  } catch (err) {
    error('activities', err.message);
    res.status(500).json({ error:'Failed' });
  }
});

// ---------- Admin global overview
app.get('/admin/overview', authAdmin, async (req, res) => {
  try {
    const [studentCount, visitCount, subsCount] = await Promise.all([
      Student.countDocuments({ adminId: req.admin._id }),
      Visit.countDocuments({ refAdminId: req.admin._id }),
      Subscription.countDocuments({ userId: req.admin._id, active: true })
    ]);

    res.json({
      success: true,
      overview: {
        students: studentCount,
        visits: visitCount,
        activeSubscriptions: subsCount,
        securityRequired: req.admin.settings.requireSecurityCode || false
      }
    });
  } catch (err) {
    error('overview', err.message);
    res.status(500).json({ error: 'Failed to load overview' });
  }
});

// ---------- 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ---------- Error handling middleware
app.use((err, req, res, next) => {
  error('server middleware', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ---------- Server startup
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    success('MongoDB connected ✅');

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => success(`Server running on port ${PORT} 🚀`));
  } catch (err) {
    error('startup', err.message);
    process.exit(1);
  }
}

start();

export default app;