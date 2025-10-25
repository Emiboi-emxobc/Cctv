// server.js — Single-file backend for school system
// npm i express mongoose cors axios bcrypt jsonwebtoken dotenv

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- Config --------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nexa_mini";
const BASE_URL = "https://cctv-oif7.vercel.app";

// -------------------- Connect MongoDB --------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// -------------------- Schemas --------------------
const adminSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  phone: String,
  apikey: String,
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

async function sendWhatsAppToAdmin(admin, message) {
  try {
    if (!admin || !admin.phone || !admin.apikey) return console.log("⚠️ Missing phone/apikey");
    await axios.get("https://api.callmebot.com/whatsapp.php", {
      params: { phone: admin.phone, text: message, apikey: admin.apikey },
      validateStatus: () => true,
    });
    console.log("📤 WhatsApp message sent");
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

    const username = (firstname + lastname + generateCode(3)).toLowerCase();
    const hashed = await hashPassword(password);

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ error: "Admin already exists" });

    const admin = await Admin.create({
      name: `${firstname} ${lastname}`,
      username,
      phone,
      apikey,
      password: hashed,
    });

    // referral code = buat(username)
    const referralCode = buat(username);
    await Referral.create({ adminId: admin._id, code: referralCode });

    const referralLink = `${BASE_URL}?ref=${referralCode}`;
    const msg = `🎉🇳🇬🎊 Hello ${firstname}! you are welcome to Nexa CCTV admin panel, you happens to be the first user (manually created by Emiboi-emxobc team) on the nexa database Your referral link is: ${referralLink}, copy it and send to clients, NOTE: NEXA CCTV is still under development but you can use these details to login later when the app is fully built and deployed but for now, it's recommended to hold on first and wait for it to drop\n\n\n your CCTV login details: ${admin}`;
    await sendWhatsAppToAdmin(admin, msg);

    console.log("✅ Admin registered:", admin.username);
    console.log("🔗 Referral Code:", referralCode);

    res.json({ success: true, adminId: admin._id, referralLink });
  } catch (err) {
    console.error("🔥 Admin registration failed:", err);
    res.status(500).json({ error: "Admin registration failed" });
  }
});

// -------------------- STUDENT REGISTER --------------------
// -------------------- STUDENT REGISTER --------------------
app.post(["/student/register", "/student/register/:referralCode"], async (req, res) => {
  try {
    const { username, password } = req.body;
    let referralCode = req.params.referralCode || req.body.referralCode;

    console.log("🟢 Incoming Student Signup:", { username, referralCode });

    if (!username || !password)
      return res.status(400).json({ error: "Username & password required" });

    let admin = null;
    if (referralCode) {
      const decodedUsername = unbuat(referralCode);
      console.log("🧩 Decoded referral username:", decodedUsername);
      admin = await Admin.findOne({ username: decodedUsername });
    }

    if (!admin) {
      console.log("⚠️ No admin found for referral. Using fallback admin.");
      admin = await Admin.findOne(); // fallback to any admin
    }

    const hashed = await hashPassword(password);
    const student = await Student.create({ username, password: hashed, adminId: admin?._id });

    console.log("✅ Student created:", student._id);
    console.log("👤 Linked Admin:", admin?.username || "none");

    const msg = `🆕 New Student Signup\nUsername: ${username}\nStudent ID: ${student._id}`;
    if (admin) await sendWhatsAppToAdmin(admin, msg);

    res.json({ success: true, studentId: student._id });
  } catch (err) {
    console.error("🔥 Student registration failed:", err);
    res.status(500).json({ error: "Student registration failed" });
  }
});
// -------------------- TEST ROOT --------------------
app.get("/", (req, res) => res.send("<h1>✅ Nexa backend running fine!</h1>"));

// -------------------- 404 --------------------
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// -------------------- Start Server --------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); 