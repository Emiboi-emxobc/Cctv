// server.js
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

// ------------- CONFIG -------------
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "nexa_secret_key";

// ------------- MONGO -------------
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ------------- CLOUDINARY -------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "",
  api_key: process.env.CLOUDINARY_KEY || "",
  api_secret: process.env.CLOUDINARY_SECRET || "",
});

// ------------- MULTER -------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ------------- MODELS -------------
const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  avatar: String, // secure_url
  avatarPublicId: String, // cloudinary public_id for deletion
  banner: String,
  bannerPublicId: String,
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

// ------------- HELPERS -------------
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

// ------------- ROUTES -------------
// Root
app.get("/", (req, res) => res.send("<h1>✅ Nexa backend live</h1>"));

// Admin register
// Admin register (auto-generate username)
app.post("/admin/register", async (req, res) => {
  try {
    const { firstname, lastname, phone, password, apikey } = req.body;
    if (!firstname || !lastname || !phone || !password) {
      return res.status(400).json({ success: false, error: "All fields required" });
    }

    // check if phone already registered
    const existing = await Admin.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, error: "Phone number already registered" });
    }

    // Generate unique username automatically
    const base = `${firstname.toLowerCase()}_${lastname.toLowerCase()}`.replace(/\s+/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    const username = `${base}_${random}`;

    const hashed = await bcrypt.hash(password, 10);
    const defaultAvatar =
      process.env.DEFAULT_AVATAR_URL ||
      "https://res.cloudinary.com/demo/image/upload/v1690000000/default_avatar.png";

    const admin = await Admin.create({
      username,
      phone,
      password: hashed,
      avatar: defaultAvatar,
      banner: "",
      slogan: "",
      bio: "",
      referralCode: apikey || `${username}_${random}`,
    });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: {
        username: admin.username,
        phone: admin.phone,
        avatar: admin.avatar,
        referralCode: admin.referralCode,
      },
    });
  } catch (err) {
    console.error("❌ Admin register error:", err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});
// Admin login
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ success: false, error: "User not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ success: false, error: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, message: "Login successful", token, admin: { username: admin.username, avatar: admin.avatar, banner: admin.banner } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// Admin profile
app.get("/admin/profile", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("-password");
    res.json({ success: true, profile: admin });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
});

// Admin update (slogan, bio)
app.post("/admin/update", verifyToken, async (req, res) => {
  try {
    const { slogan, bio } = req.body;
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });

    if (slogan) admin.slogan = slogan;
    if (bio) admin.bio = bio;
    await admin.save();

    res.json({ success: true, message: "Profile updated", profile: admin });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
});

// ----------------- CLOUDINARY UPLOAD (improved) -----------------
app.post("/admin/upload-cloud", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { type } = req.body; // expected 'avatar' or 'banner'
    if (!req.file) return res.status(400).json({ success: false, error: "No image provided" });

    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });

    // Upload stream with meaningful public_id
    const publicIdBase = `${admin.username}_${type}_${Date.now()}`;
    const folder = process.env.CLOUDINARY_FOLDER || "nexa_mini";

    const result = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicIdBase,
          transformation: [
            { width: 800, height: 800, crop: "limit" }, // safety
          ],
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(upload);
    });

    // If there was a previous image, attempt to delete it (best effort)
    try {
      if (type === "avatar" && admin.avatarPublicId) {
        await cloudinary.uploader.destroy(admin.avatarPublicId).catch(() => {});
      }
      if (type === "banner" && admin.bannerPublicId) {
        await cloudinary.uploader.destroy(admin.bannerPublicId).catch(() => {});
      }
    } catch (delErr) {
      // don't fail the request if delete fails
      console.warn("Old image deletion warning:", delErr);
    }

    // Save new url + public_id
    if (type === "avatar") {
      admin.avatar = result.secure_url;
      admin.avatarPublicId = result.public_id;
    } else if (type === "banner") {
      admin.banner = result.secure_url;
      admin.bannerPublicId = result.public_id;
    } else {
      // Unknown type: still return url but don't save
      return res.json({ success: true, message: "Uploaded", imageUrl: result.secure_url, raw: result });
    }

    await admin.save();

    res.json({
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
    console.error("❌ Upload failed:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

// Student register
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
    console.error("Student register failed:", err);
    res.status(500).json({ success: false, error: "Student registration failed" });
  }
});

// Get students by admin
app.get("/admin/students", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ success: false, error: "Admin not found" });
    const students = await Student.find({ referrer: admin.username });
    res.json({ success: true, students });
  } catch (err) {
    console.error("Fetch students failed:", err);
    res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});

// Public: get all admins (lean for performance)
app.get("/admins/public", async (req, res) => {
  try {
    const admins = await Admin.find().select("-password -__v").lean();
    res.json({ success: true, admins });
  } catch (err) {
    console.error("❌ Failed to fetch admin:", err);
    res.status(500).json({ success: false, error: "Failed to fetch admins" });
  }
});

// Start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));