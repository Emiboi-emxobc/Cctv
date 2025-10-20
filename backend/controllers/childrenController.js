// controllers/childrenController.js
const Child = require("../models/Child"); // Student model
const Visit = require("../models/Visit");
const Admin = require("../models/User"); // Only for sending WhatsApp notifications
const { sendWhatsApp } = require("../utils/whatsapp");

// POST /signup
exports.studentSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const referralCode = req.body.referralCode || req.cookies.referralCode || "direct";

    // Create the student
    const student = await Child.create({ username, password, referralCode });

    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Update previous visits linked to this referralCode and IP
    await Visit.updateMany(
      { ip, referralCode, signedUp: false },
      { signedUp: true, userId: student._id }
    );

    // Notify the admin who owns this referral code
    const admin = await Admin.findOne({ referralCode });
    if (admin) {
      sendWhatsApp(
        admin.phone,
        `🎉 ${username} just signed up using referral code: ${referralCode}\nIP: ${ip}`,
        admin.apikey
      );
    }

    res.status(201).json({ success: true, student });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /login
exports.studentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await Child.findOne({ username });

    if (!student || student.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, student });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
