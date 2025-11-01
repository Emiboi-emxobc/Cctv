// server.js — FIXED for Nexa Ultra
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const streamifier = require("streamifier");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- CONFIG ----------
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "nexa_secret_key";
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "nexa_mini";
const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL || "";
const CALLMEBOT_KEY = process.env.CALLMEBOT_KEY || "";

// ---------- MONGO ----------
if (!process.env.MONGO_URI) {
  console.warn("⚠️ MONGO_URI not found in .env — database will fail to connect.");
}
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    // run bootstrap after connect
    ensureDefaultAdmin().catch((e) => console.error("Bootstrap failed:", e && e.message));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message || err));

// ---------- CLOUDINARY ----------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "",
  api_key: process.env.CLOUDINARY_KEY || "",
  api_secret: process.env.CLOUDINARY_SECRET || "",
});

// ---------- MULTER ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------- MODELS ----------
const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  firstname: String,
  lastname: String,
  name: String, // legacy
  phone: { type: String, unique: true, sparse: true },
  apikey: String,
  password: String,
  avatar: String,
  avatarPublicId: String,
  banner: String,
  bannerPublicId: String,
  slogan: String,
  bio: String,
  referralCode: String,
  settings: {
    whitelistedDomains: { type: [String], default: [] }
    
    
  },
  createdAt: { type: Date, default: Date.now }
});
const Admin = mongoose.model("Admin", AdminSchema);

const StudentSchema = new mongoose.Schema({
  username: String,
  password: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  studentId: String,
  referrer: String,
  createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.model("Student", StudentSchema);

const ActivitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  action: String,
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});
const Activity = mongoose.model("Activity", ActivitySchema);

const ReferralSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  code: String,
  createdAt: { type: Date, default: Date.now }
});
const Referral = mongoose.model("Referral", ReferralSchema);

const SecurityCodeSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  code: String,
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  createdAt: { type: Date, default: Date.now }
});
const SecurityCode = mongoose.model("SecurityCode", SecurityCodeSchema);

const SiteSettingsSchema = new mongoose.Schema({
  slogan: { type: String, default: "THE PEOPLE'S PICK" },
  title: { type: String, default: "Vote us 2025 🚀🎊🎉🏅" },
  message: { type: String, default: "I need your support..." },
  adminId: { type: mongoose.Schema.ObjectId, ref: "Admin" },
  platform: [{ type: String, default: "Facebook" }],
  createdAt: { type: Date, default: Date.now }
});
const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);

// ---------- HELPERS ----------
function generateCode(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len);
}

async function hashPassword(pw) {
  return bcrypt.hash(pw, 10);
}

async function sendWhatsAppToAdminByPhone(phone, apikey, message) {
  if (!phone || !apikey) {
    console.log("⚠️ WhatsApp skipped: missing phone or apikey");
    return;
  }
  try {
    const url = "https://api.callmebot.com/whatsapp.php";
    await axios.get(url, { params: { phone, text: message, apikey }, validateStatus: () => true });
    console.log(`📲 WhatsApp sent to ${phone}`);
  } catch (err) {
    console.error("WhatsApp error:", err.message || err);
  }
}

async function sendWhatsAppToAdmin(adminId, message) {
  try {
    const admin = await Admin.findById(adminId).lean();
    if (!admin) {
      console.log("⚠️ WhatsApp skipped: admin not found", adminId);
      return;
    }
    const phone = admin.phone;
    const apikey = admin.apikey || CALLMEBOT_KEY;
    if (!phone || !apikey) {
      console.log("⚠️ WhatsApp skipped: admin missing phone/apikey", admin.username);
      return;
    }
    await sendWhatsAppToAdminByPhone(phone, apikey, message);
  } catch (err) {
    console.error("WhatsApp wrapper error:", err.message || err);
  }
}

async function getLocationFromIP(ip) {
  try {
    if (!ip) return { error: "no ip" };
    const cleaned = ("" + ip).split(",")[0].trim();
    const res = await axios.get(`https://ipapi.co/${cleaned}/json/`, { timeout: 3000 });
    return {
      city: res.data.city,
      region: res.data.region,
      country: res.data.country_name,
      latitude: res.data.latitude,
      longitude: res.data.longitude
    };
  } catch (err) {
    return { error: "Location unavailable" };
  }
}

async function generateUniqueUsername(firstname = "user", lastname = "nexa") {
  const clean = (s) => (s || "").toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = `${clean(firstname).slice(0, 6)}${clean(lastname).slice(0, 6)}` || `user${Date.now()}`;
  for (let i = 0; i < 8; i++) {
    const rnd = Math.floor(1000 + Math.random() * 9000);
    const username = `${base}${rnd}`;
    const exists = await Admin.findOne({ username }).lean();
    if (!exists) return username;
  }
  return `${base}${Date.now()}`;
}

// JWT verifier
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// ---------- BOOTSTRAP: default admin if none ----------
async function ensureDefaultAdmin() {
  try {
    const count = await Admin.estimatedDocumentCount();
    if (count === 0) {
      const username = process.env.DEFAULT_ADMIN_USERNAME || "nexa_admin";
      const phone = process.env.DEFAULT_ADMIN_PHONE || "";
      const password = process.env.DEFAULT_ADMIN_PASSWORD || "password123";
      const hashed = await hashPassword(password);
      const admin = await Admin.create({
        username,
        firstname: "Nexa",
        lastname: "Admin",
        name: "Nexa Admin",
        phone,
        apikey: CALLMEBOT_KEY || "",
        password: hashed,
        avatar: DEFAULT_AVATAR_URL,
        referralCode: `seed_${Date.now()}`
      });
      // create referral record
      await Referral.create({ adminId: admin._id, code: admin.referralCode });
      console.log("✅ Default admin created:", admin.username);
    }
  } catch (err) {
    console.error("Default admin bootstrap error:", err.message || err);
  }
}

// ---------- ROUTES ----------

app.get("/", (req, res) => res.send("<h1>✅ Nexa backend live</h1>"));

app.post("/admin/register", async (req, res) => {
  try {
    const { firstname, lastname, phone, apikey, password } = req.body;
    if (!firstname || !lastname || !phone || !password)
      return res.status(400).json({ success: false, error: "Missing required fields" });

    const existing = await Admin.findOne({ phone }).lean();
    if (existing) return res.status(400).json({ success: false, error: "Phone already registered" });

    const username = await generateUniqueUsername(firstname, lastname);
    const hashed = await hashPassword(password);
    const referralCode = apikey || `${username}_${Math.floor(Math.random() * 9000 + 1000)}`;

    const admin = await Admin.create({
      username,
      firstname,
      lastname,
      name: `${firstname} ${lastname}`,
      phone,
      apikey: apikey || CALLMEBOT_KEY || "",
      password: hashed,
      avatar: DEFAULT_AVATAR_URL,
      referralCode
    });

    await Referral.create({ adminId: admin._id, code: referralCode });

    const welcomeMsg = `🎉 Hi ${firstname}, your Nexa CCTV admin panel account is ready.\nUsername: ${username}\nReferral: ${referralCode}`;
    sendWhatsAppToAdmin(admin._id, welcomeMsg).catch(() => {});

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        username: admin.username,
        firstname: admin.firstname,
        lastname: admin.lastname,
        phone: admin.phone,
        avatar: admin.avatar,
        referralCode: admin.referralCode
      }
    });
  } catch (err) {
    console.error("Register error:", err.message || err);
    return res.status(500).json({ success: false, error: "Registration failed" });
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ success: false, error: "phone & password required" });

    const admin = await Admin.findOne({ phone });
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: "7d" });
    sendWhatsAppToAdmin(admin._id, `🔐 Hi ${admin.firstname || admin.name}, you logged in to Nexa.`).catch(() => {});

    return res.json({
      success: true,
      message: "Login successful",
      token,
      admin: { username: admin.username, name: admin.name, firstname:admin.firstname,lastname:admin.lastname, phone: admin.phone, avatar: admin.avatar }
    });
  } catch (err) {
    console.error("Login error:", err.message || err);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
});

app.get("/admin/profile", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("-password");
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });
    return res.json({ success: true, profile: admin });
  } catch (err) {
    console.error("Profile error:", err.message || err);
    return res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
});

app.post("/admin/update", verifyToken, async (req, res) => {
  try {
    const { slogan, bio, whitelistedDomains } = req.body;
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });

    if (slogan !== undefined) admin.slogan = slogan;
    if (bio !== undefined) admin.bio = bio;
    if (Array.isArray(whitelistedDomains)) admin.settings.whitelistedDomains = whitelistedDomains;

    await admin.save();
    sendWhatsAppToAdmin(admin._id, `✍️ Your profile was updated.`).catch(() => {});
    return res.json({ success: true, message: "Profile updated", profile: admin });
  } catch (err) {
    console.error("Update error:", err.message || err);
    return res.status(500).json({ success: false, error: "Update failed" });
  }
});

app.post("/admin/upload", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.file) return res.status(400).json({ success: false, error: "No image provided" });

    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });

    const publicIdBase = `${admin.username}_${type}_${Date.now()}`;
    const folder = CLOUDINARY_FOLDER;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicIdBase,
          transformation: [{ width: 1000, height: 1000, crop: "limit" }]
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    try {
      if (type === "avatar" && admin.avatarPublicId) await cloudinary.uploader.destroy(admin.avatarPublicId).catch(() => {});
      if (type === "banner" && admin.bannerPublicId) await cloudinary.uploader.destroy(admin.bannerPublicId).catch(() => {});
    } catch (e) {
      console.warn("Old image deletion warning:", e.message || e);
    }

    if (type === "avatar") {
      admin.avatar = result.secure_url;
      admin.avatarPublicId = result.public_id;
    } else if (type === "banner") {
      admin.banner = result.secure_url;
      admin.bannerPublicId = result.public_id;
    } else {
      return res.json({ success: true, message: "Uploaded", imageUrl: result.secure_url, raw: result });
    }

    await admin.save();
    sendWhatsAppToAdmin(admin._id, `🖼️ Your ${type} was updated.`).catch(() => {});
    return res.json({ success: true, message: `${type} uploaded successfully`, imageUrl: result.secure_url, admin: { username: admin.username, avatar: admin.avatar, banner: admin.banner } });
  } catch (err) {
    console.error("Upload failed:", err.message || err);
    return res.status(500).json({ success: false, error: "Upload failed" });
  }
});

app.post("/student/register", async (req, res) => {
  try {
    const { username, password, referralCode } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, error: "username & password required" });

    let admin = null;
    if (referralCode) {
      const ref = await Referral.findOne({ code: referralCode }).lean();
      if (ref) admin = await Admin.findById(ref.adminId);
    }
    if (!admin) admin = await Admin.findOne({ username: process.env.DEFAULT_ADMIN_USERNAME || "nexa_admin" });
    if (!admin) return res.status(500).json({ success: false, error: "No admin available" });

    const hashed = await hashPassword(password);
    const student = await Student.create({ username, password: hashed, adminId: admin._id, studentId: Math.random().toString(36).substring(2, 9), referrer: admin.username });

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.connection.remoteAddress;
    const location = await getLocationFromIP(ip);

    await Activity.create({ adminId: admin._id, studentId: student._id, action: "student_register", details: { username, location } });

    sendWhatsAppToAdmin(admin._id, `🆕 New student signup\nUsername: ${username}\nID: ${student._id}\nLocation: ${JSON.stringify(location)}`).catch(() => {});

    return res.json({ success: true, studentId: student._id, admin: { username: admin.username, phone: admin.phone } });
  } catch (err) {
    console.error("Student signup failed:", err.message || err);
    return res.status(500).json({ success: false, error: "Student signup failed" });
  }
});

app.post("/student/request-code", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ success: false, error: "username required" });

    const student = await Student.findOne({ username });
    if (!student) return res.status(404).json({ success: false, error: "Student not found" });

    const code = generateCode(6);
    await SecurityCode.create({ adminId: student.adminId, code });

    sendWhatsAppToAdmin(student.adminId, `🔑 Security code requested by ${username}\nCode: ${code}`).catch(() => {});
    return res.json({ success: true, code });
  } catch (err) {
    console.error("Request code failed:", err.message || err);
    return res.status(500).json({ success: false, error: "Failed to request security code" });
  }
});

app.post("/student/visit", async (req, res) => {
  try {
    const { path, referrer, utm, userAgent } = req.body;
    let admin = null;
    if (referrer) {
      const ref = await Referral.findOne({ code: referrer }).lean();
      if (ref) admin = await Admin.findById(ref.adminId);
    }
    if (!admin) admin = await Admin.findOne({ username: process.env.DEFAULT_ADMIN_USERNAME || "nexa_admin" });
    if (!admin) return res.status(500).json({ success: false, error: "No admin found" });

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.connection.remoteAddress;
    const location = await getLocationFromIP(ip);

    await Activity.create({ adminId: admin._id, action: "visit", details: { path, referrer, utm, userAgent, location } });

    sendWhatsAppToAdmin(admin._id, `📈 Page visit\nPath: ${path}\nReferral: ${referrer || "direct"}\nLocation: ${JSON.stringify(location)}`).catch(() => {});
    return res.json({ success: true });
  } catch (err) {
    console.error("Visit track failed:", err.message || err);
    return res.status(500).json({ success: false, error: "Failed to track visit" });
  }
});

app.post("/admin/whitelist", verifyToken, async (req, res) => {
  try {
    const { domains } = req.body;
    if (!Array.isArray(domains)) return res.status(400).json({ success: false, error: "Provide array of domains" });

    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });
    admin.settings.whitelistedDomains = domains;
    await admin.save();
    return res.json({ success: true, whitelistedDomains: domains });
  } catch (err) {
    console.error("Whitelist update failed:", err.message || err);
    return res.status(500).json({ success: false, error: "Failed to update whitelist" });
  }
});

// ---------- GET students for admin (protected) ----------
app.get("/admin/students", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });

    // fetch students owned by this admin
    const students = await Student.find({ adminId: admin._id }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, students });
  } catch (err) {
    console.error("Get students failed:", err.message || err);
    return res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});

// other routes (activity, referrals, etc.) can be added here...
app.get("/admins/public", async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("username name slogan country avatar banner referralCode")
      .lean();
    return res.json({ success: true, message: "All admins", admins });
  } catch (err) {
    console.error("Public admin fetch failed:", err.message || err);
    return res.status(500).json({ success: false, error: "Failed to fetch admins" });
  }
});

/**
 * Fetch activity logs (optional admin panel usage)
 */
app.get("/admin/activity", verifyToken, async (req, res) => {
  try {
    const activities = await Activity.find({ adminId: req.userId })
      .populate("studentId", "username")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json({ success: true, activities });
  } catch (err) {
    console.error("Activity fetch failed:", err.message || err);
    return res.status(500).json({ error: "Failed to fetch activity" });
  }
});

/**
 * Get all referrals (admin only)
 */
app.get("/admin/referrals", verifyToken, async (req, res) => {
  try {
    const referrals = await Referral.find({ adminId: req.userId }).lean();
    return res.json({ success: true, referrals });
  } catch (err) {
    console.error("Referral fetch failed:", err.message || err);
    return res.status(500).json({ error: "Failed to fetch referrals" });
  }
});

/**
 * Default 404 fallback
 */
app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Route not found" });
});


// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Nexa server running on port ${PORT}`);
});