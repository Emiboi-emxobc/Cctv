// server.js — Final complete file for Nexa Mini Backend
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const streamifier = require("streamifier");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- CONFIG ----------
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "nexa_secret_key";
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "nexa_mini";
const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL || ""; // optional fallback

// ---------- MONGO ----------
if (!process.env.MONGO_URI) {
  console.warn("⚠️ MONGO_URI not found in .env — database will fail to connect.");
}
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

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
  username: { type: String, unique: true },
  firstname: String,
  lastname: String,
  phone: { type: String, unique: true, sparse: true },
  password: String,
  avatar: String,
  avatarPublicId: String,
  banner: String,
  bannerPublicId: String,
  slogan: String,
  bio: String,
  referralCode: String,
  createdAt: { type: Date, default: Date.now },
});
const Admin = mongoose.model("Admin", AdminSchema);

const StudentSchema = new mongoose.Schema({
  username: String,
  studentId: String,
  referrer: String,
  createdAt: { type: Date, default: Date.now },
});
const Student = mongoose.model("Student", StudentSchema);

// ---------- HELPERS ----------
async function generateUniqueUsername(firstname = "user", lastname = "nexa") {
  const clean = (s) => (s || "").toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = `${clean(firstname).slice(0, 6)}${clean(lastname).slice(0, 6)}` || `user${Date.now()}`;
  for (let i = 0; i < 6; i++) { // try up to 6 times before falling back
    const rnd = Math.floor(1000 + Math.random() * 9000);
    const username = `${base}${rnd}`;
    const exists = await Admin.findOne({ username }).lean();
    if (!exists) return username;
  }
  // final fallback
  return `${base}${Date.now()}`;
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// ---------- ROUTES ----------

// Root
app.get("/", (req, res) => res.send("<h1>✅ Nexa backend live</h1>"));

// Admin register — accepts firstname, lastname, phone, password (and optional apikey/referrer)
app.post("/admin/register", async (req, res) => {
  try {
    const { firstname, lastname, phone, password, apikey } = req.body;
    if (!firstname || !lastname || !phone || !password) {
      return res.status(400).json({ success: false, error: "firstname, lastname, phone and password are required" });
    }

    // prevent duplicate phone
    const existingByPhone = await Admin.findOne({ phone }).lean();
    if (existingByPhone) {
      return res.status(400).json({ success: false, error: "Phone already registered" });
    }

    const username = await generateUniqueUsername(firstname, lastname);
    const hashed = await bcrypt.hash(password, 10);
    const referralCode = apikey || `${username}_${Math.floor(Math.random() * 9000 + 1000)}`;

    const admin = await Admin.create({
      username,
      firstname,
      lastname,
      phone,
      password: hashed,
      avatar: DEFAULT_AVATAR_URL,
      banner: "",
      referralCode,
    });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

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
        referralCode: admin.referralCode,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    // handle duplicate username/phone more gracefully if needed
    return res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// Admin login (phone + password)
app.post("/admin/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ success: false, error: "phone and password required" });

    const admin = await Admin.findOne({ phone });
    if (!admin) return res.status(404).json({ success: false, error: "User not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ success: false, error: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        username: admin.username,
        firstname: admin.firstname,
        lastname: admin.lastname,
        avatar: admin.avatar,
        banner: admin.banner,
        slogan: admin.slogan,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
});

// Admin profile (protected)
app.get("/admin/profile", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("-password");
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });
    return res.json({ success: true, profile: admin });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
});

// Admin update (slogan, bio)
app.post("/admin/update", verifyToken, async (req, res) => {
  try {
    const { slogan, bio } = req.body;
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });

    if (slogan !== undefined) admin.slogan = slogan;
    if (bio !== undefined) admin.bio = bio;
    await admin.save();

    return res.json({ success: true, message: "Profile updated", profile: admin });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ success: false, error: "Update failed" });
  }
});

// Upload avatar/banner — protected, receives multipart/form-data (field name: image)
app.post("/admin/upload", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { type } = req.body; // expected 'avatar' or 'banner'
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
          transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    // delete previous image if public id present (best-effort)
    try {
      if (type === "avatar" && admin.avatarPublicId) {
        await cloudinary.uploader.destroy(admin.avatarPublicId).catch(() => {});
      } else if (type === "banner" && admin.bannerPublicId) {
        await cloudinary.uploader.destroy(admin.bannerPublicId).catch(() => {});
      }
    } catch (delErr) {
      console.warn("Old image deletion warning:", delErr);
    }

    if (type === "avatar") {
      admin.avatar = result.secure_url;
      admin.avatarPublicId = result.public_id;
    } else if (type === "banner") {
      admin.banner = result.secure_url;
      admin.bannerPublicId = result.public_id;
    } else {
      // Unknown type: return URL but do not save
      return res.json({ success: true, message: "Uploaded", imageUrl: result.secure_url, raw: result });
    }

    await admin.save();

    return res.json({
      success: true,
      message: `${type} uploaded successfully`,
      imageUrl: result.secure_url,
      admin: {
        username: admin.username,
        avatar: admin.avatar,
        banner: admin.banner,
      },
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).json({ success: false, error: "Upload failed" });
  }
});

// Student register (same as before)
app.post("/student/register", async (req, res) => {
  try {
    const { username, referrer } = req.body;
    const student = await Student.create({
      username,
      studentId: Math.random().toString(36).substring(2, 9),
      referrer,
    });
    return res.json({ success: true, message: "Student registered", student });
  } catch (err) {
    console.error("Student register failed:", err);
    return res.status(500).json({ success: false, error: "Student registration failed" });
  }
});

// Get students belonging to admin (protected)
app.get("/admin/students", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });
    const students = await Student.find({ referrer: admin.username }).lean();
    return res.json({ success: true, students });
  } catch (err) {
    console.error("Fetch students failed:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});

// Public: get all admins for frontend consumption
app.get("/admins/public", async (req, res) => {
  try {
    const admins = await Admin.find().select("-password -__v").lean();
    // Optionally, massage results to include full display name
    const out = admins.map((a) => ({
      _id: a._id,
      username: a.username,
      name: `${a.firstname || ""} ${a.lastname || ""}`.trim(),
      avatar: a.avatar || DEFAULT_AVATAR_URL,
      slogan: a.slogan || "",
      country: a.country || "", // if you later add country
    }));
    return res.json({ success: true, admins: out });
  } catch (err) {
    console.error("Fetch admins failed:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch admins" });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));