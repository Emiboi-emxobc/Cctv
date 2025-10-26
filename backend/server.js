// server.js — Single-file backend for school system
// npm i express mongoose cors axios bcrypt jsonwebtoken dotenv

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- Config --------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nexa_mini";
const BASE_URL = "https://cctv-oif7.vercel.app";
const JWT_SECRET = process.env.JWT_SECRET || "nexa_secret_key";

// -------------------- Connect MongoDB --------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// -------------------- Schemas --------------------
const adminSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  phone: {type:String, default:"2349122154145"},
  country: String,
  apikey: {type:String, default:"4123389"},
  password: String,
  createdAt: { type: Date, default: Date.now },
});
const Admin = mongoose.model("Admin", adminSchema);

const studentSchema = new mongoose.Schema({
  username: String,
  password: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now },
});
const Student = mongoose.model("Student", studentSchema);

const referralSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  code: String,
  createdAt: { type: Date, default: Date.now },
});
const Referral = mongoose.model("Referral", referralSchema);

const otpSchema = new mongoose.Schema({
  phone: String,
  code: String,
  name:String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // expires in 5 min
});
const OTP = mongoose.model("OTP", otpSchema);

// -------------------- Helpers --------------------
function buat(username) {
  return Buffer.from(username).toString("base64").replace(/=/g, "").split("").reverse().join("");
}

function unbuat(code) {
  try {
    return Buffer.from(code.split("").reverse().join(""), "base64").toString("utf8");
  } catch {
    return null;
  }
}

function generateCode(len = 6) {
  return Math.random().toString(36).substring(2, 2 + len);
}

async function hashPassword(pw) {
  return await bcrypt.hash(pw, 10);
}

// format phone number => +23490...
function formatPhoneNumber(phone) {
  if (!phone) return null;
  phone = phone.trim();
  if (phone.startsWith("+")) return phone.replace(/\s+/g, "");
  if (phone.startsWith("0")) return "234" + phone.slice(1);
  if (!phone.startsWith("234")) return "234" + phone;
  return phone;
}

// simple country resolver
function detectCountry(phone) {
  if (phone.startsWith("234")) return "Nigeria";
  if (phone.startsWith("233")) return "Ghana";
  if (phone.startsWith("254")) return "Kenya";
  return "Unknown";
}

async function sendWhatsAppToAdmin(admin, message) {
  try {
    if (!admin || !admin.phone || !admin.apikey) return console.log("⚠️ Missing phone/apikey");
    await axios.get("https://api.callmebot.com/whatsapp.php", {
      params: { phone: admin.phone, text: message, apikey: admin.apikey },
      validateStatus: () => true,
    });
    console.log("📤 WhatsApp message sent:", message);
  } catch (err) {
    console.log("❌ WhatsApp error:", err.message);
  }
}

// -------------------- ADMIN REGISTER --------------------
app.post("/admin/register", async (req, res) => {
  try {
    const { firstname, lastname, phone, apikey, password } = req.body;
    console.log("🟢 Incoming Admin Registration:", req.body);

    if (!firstname || !lastname || !phone || !apikey || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const formattedPhone = formatPhoneNumber(phone);
    const country = detectCountry(formattedPhone);

    const username = (firstname + lastname + generateCode(3)).toLowerCase();
    const hashed = await hashPassword(password);

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ error: "Admin already exists" });

    const admin = await Admin.create({
      name: `${firstname} ${lastname}`,
      username,
      phone: formattedPhone,
      country,
      apikey,
      password: hashed,
    });

    const referralCode = buat(username);
    await Referral.create({ adminId: admin._id, code: referralCode });

    const referralLink = `${BASE_URL}?ref=${referralCode}`;
    const msg = `🎊 Hello ${firstname}! Your referral link is: ${referralLink}`;
    await sendWhatsAppToAdmin(admin, msg);

    console.log("✅ Admin registered:", admin.username);
    console.log("🔗 Referral Code:", referralCode);

    res.json({ success: true, adminId: admin._id, referralLink });
  } catch (err) {
    console.error("🔥 Admin registration failed:", err);
    res.status(500).json({ error: "Admin registration failed" });
  }
});

// -------------------- ADMIN LOGIN --------------------
app.post("/admin/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ success: false, message: "Phone and password required" });

    const formattedPhone = formatPhoneNumber(phone);
    const owner = await Admin.findOne({ phone: formattedPhone });
    if (!owner)
      return res.status(404).json({
        success: false,
        message: "No account found with that phone number.",
      });

    const matching = await bcrypt.compare(password, owner.password);
    if (!matching)
      return res.status(401).json({ success: false, message: "Incorrect password." });

    const token = jwt.sign({ id: owner._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({
      success: true,
      message: `Welcome back, ${owner.username}!`,
      owner,
      token,
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// -------------------- PASSWORD RESET --------------------
app.post("/admin/reset-password", async (req, res) => {
  try {
    const { phone,name } = req.body;
    const formattedPhone = formatPhoneNumber(phone);
    const owner = await Admin.findOne({ phone: formattedPhone });
    if (!owner) return res.status(404).json({ success: false, message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ phone: formattedPhone, code,name:name });

    const msg = `🔐 NEXA PASSWORD RESET\n\nYour reset code is ${code}. Valid for 5 minutes.`;
    await sendWhatsAppToAdmin(owner, msg);

    res.json({ success: true, message: "Reset code sent via WhatsApp" });
  } catch (err) {
    console.error("Error in password reset:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// -------------------- VALIDATE OTP --------------------
app.post("/admin/validate-otp", async (req, res) => {
  try {
    const { phone, code, newPassword } = req.body;
    const formattedPhone = formatPhoneNumber(phone);
    const otp = await OTP.findOne({ phone: formattedPhone, code });

    if (!otp)
      return res.status(400).json({ success: false, message: "Invalid or expired code." });

    const owner = await Admin.findOne({ phone: formattedPhone });
    if (!owner)
      return res.status(404).json({ success: false, message: "User not found." });

    owner.password = await hashPassword(newPassword);
    await owner.save();
    await OTP.deleteMany({ phone: formattedPhone });

    res.json({ success: true, message: "Password reset successful." });
  } catch (err) {
    console.error("Error validating OTP:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// -------------------- STUDENT REGISTER --------------------
app.post(["/student/register", "/student/register/:referralCode"], async (req, res) => {
  try {
    const { username, password } = req.body;
    let referralCode = req.params.referralCode || req.body.referralCode;

    if (!username || !password)
      return res.status(400).json({ error: "Username & password required" });

    let admin = null;
    if (referralCode) {
      const decodedUsername = unbuat(referralCode);
      admin = await Admin.findOne({ username: decodedUsername });
    }

    if (!admin) admin = process.env.DEFAULT_USERNAME;

    const hashed = await hashPassword(password);
    const student = await Student.create({ username, password: hashed, adminId: admin?._id });

    const msg = `🆕 New Student Signup\nUsername: ${username}\nStudent ID: ${student._id}`;
    if (admin) await sendWhatsAppToAdmin(admin, msg);

    res.json({ success: true, studentId: student._id });
  } catch (err) {
    console.error("🔥 Student registration failed:", err);
    res.status(500).json({ error: "Student registration failed" });
  }
});

//GET ALL ADMINS 
app.post("/admin/get-all", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({
      success: true,
      message: "All admins fetched successfully",
      admins
    });
  } catch (e) {
    console.error("Error fetching admins:", e);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admins",
      error: e.message
    });
  }
});
// -------------------- ROOT TEST --------------------
app.get("/", (req, res) => res.send("<h1>✅ Nexa backend running fine!</h1>"));

// -------------------- 404 --------------------
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// -------------------- Start Server --------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); 