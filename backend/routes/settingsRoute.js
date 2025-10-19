// backend/routes/settingsRoute.js
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) {
      s = await Settings.create({
        siteName: 'Nexa',
        description: 'Quality education accessible',
        bannerText: 'Welcome to Nexa',
        platforms:["Instagram","Facebook"],
        premiumPrices: { weekly: 2000, monthly: 6000, yearly: 50000 }
      });
    }
    res.json({ success:true, settings: s });
  } catch (err) {
    res.status(500).json({ success:false, message:'Server error' });
  }
});

// POST /api/settings (admin)
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    let s = await Settings.findOne();
    if (!s) s = new Settings(body);
    else Object.assign(s, body);
    await s.save();
    res.json({ success:true, settings: s });
  } catch (err) {
    res.status(500).json({ success:false, message:'Server error' });
  }
});

module.exports = router;