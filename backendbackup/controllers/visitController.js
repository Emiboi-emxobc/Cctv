// controllers/visitController.js
const Visit = require("../models/Visit");

// Track new visit
exports.trackVisit = async (req, res) => {
  try {
    const { referralCode, path } = req.body;

    const visit = await Visit.create({
      referralCode,
      ip: req.ip,
      path,
      userAgent: req.headers["user-agent"]
    });

    res.status(201).json({ success: true, visit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error tracking visit" });
  }
};

// Fetch visits by referral code (to see who invited them)
exports.getVisitsByReferral = async (req, res) => {
  try {
    const { referralCode } = req.params;
    const visits = await Visit.find({ referralCode });
    res.json({ success: true, visits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch visits" });
  }
};