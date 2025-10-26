// ✅ NEXA Mini Backend — Production-Ready Edition

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const streamifier = require("streamifier");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// =================== MONGO CONNECTION ===================
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// =================== CLOUDINARY CONFIG ===================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// =================== MULTER SETUP ===================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =================== MODELS ===================
const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  avatar: String,
  banner: String,
  slogan: String,
  bio: String,
  phone: String,
  referralCode: String,
  createdAt: { type: Date, default: Date.now },
});
const Admin = mongoose.model("Admin", AdminSchema);

const StudentSchema = new mongoose.Schema({
  username: String,
  studentId: String,
  referrer: String,
});
const Student = mongoose.model("Student", StudentSchema);

// =================== HELPERS ===================
const JWT_SECRET = process.env.JWT_SECRET || "nexa_secret_key";

// Middleware: verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// =================== ROUTES ===================

// Default route
app.get("/", (req, res) => res.send("<h1>✅ Nexa backend live</h1>"));

// ----------------- ADMIN REGISTER -----------------
app.post("/admin/register", async (req, res) => {
  try {
    const { username, password, phone } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username & password required" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hashed, phone });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, message: "Admin registered", token });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ----------------- ADMIN LOGIN -----------------
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ----------------- ADMIN PROFILE -----------------
app.get("/admin/profile", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("-password");
    res.json({ success: true, profile: admin });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ----------------- ADMIN UPDATE PROFILE -----------------
app.post("/admin/update", verifyToken, async (req, res) => {
  try {
    const { slogan, bio } = req.body;
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    if (slogan) admin.slogan = slogan;
    if (bio) admin.bio = bio;
    await admin.save();

    res.json({ success: true, message: "Profile updated", profile: admin });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// ----------------- CLOUDINARY UPLOAD -----------------
app.post("/admin/upload-cloud", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { type } = req.body;
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "nexa_mini" },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    if (type === "avatar") admin.avatar = result.secure_url;
    else if (type === "banner") admin.banner = result.secure_url;

    await admin.save();
    res.json({ success: true, message: "Image uploaded", imageUrl: result.secure_url });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ----------------- STUDENT REGISTER -----------------
app.post("/student/register", async (req, res) => {
  try {
    const { username, referrer } = req.body;
    const student = await Student.create({
      username,
      studentId: Math.random().toString(36).substring(2, 9),
      referrer,
    });
    res.json({ success: true, message: "Student registered", student });
  } catch (err) {
    res.status(500).json({ error: "Student registration failed" });
  }
});

// ----------------- GET STUDENTS BY ADMIN -----------------
app.get("/admin/students", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    const students = await Student.find({ referrer: admin.username });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// =================== SERVER ===================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));