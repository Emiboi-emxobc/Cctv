const express = require("express");
const router = express.Router();
const Visit = require("../models/Visit");
const Child = require("../models/Child"); // Admins/students with referralCode
const { sendWhatsApp } = require("../utils/whatsapp");

// POST /api/visit/log
router.post("/log", async (req, res) => {
  try {
    const { path, referrer, utm, userAgent } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Create visit
    const visit = await Visit.create({
      path,
      referrer,
      ip,
      userAgent,
      utm: utm ? JSON.stringify(utm) : ""
    });

    // If there is a referral code, notify the admin
    if (referrer && referrer !== "direct") {
      const admin = await Child.findOne({ referralCode: referrer });
      if (admin && admin.apikey && admin.phone) {
        const msg = `
👀 New visitor detected!
Path: ${path}
IP: ${ip}
User Agent: ${userAgent}
Referral Code: ${referrer}
        `;
        sendWhatsApp(admin.phone, msg, admin.apikey);
      }
    }

    res.json({ success: true, visit });
  } catch (err) {
    console.error("Visit tracking error:", err.message);
    res.status(500).json({ success: false, message: "Failed to log visit" });
  }
});

// GET /api/visit/stats
router.get("/stats", async (req, res) => {
  try {
    const total = await Visit.countDocuments();
    const topRef = await Visit.aggregate([
      { $match: { referrer: { $exists: true, $ne: null, $ne: "" } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json({ success: true, total, topRef });
  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ success: false, message: "Failed to get stats" });
  }
});

module.exports = router;
