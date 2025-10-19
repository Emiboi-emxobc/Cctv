// backend/routes/visitRoute.js
const express = require('express');
const router = express.Router();
const Visit = require('../models/visit');

// POST /api/visit/log
router.post('/log', async (req, res) => {
  try {
    const { path, referrer, utm } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const v = await Visit.create({ path, referrer, ip, userAgent, utm });
    res.json({ success: true, visit: v });
  } catch (err) {
    console.error('Visit log error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to log visit' });
  }
});

// GET /api/visit/stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Visit.countDocuments();
    // top referrers
    const topRef = await Visit.aggregate([
      { $match: { referrer: { $exists: true, $ne: null, $ne: "" } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json({ success: true, total, topRef });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get stats' });
  }
});

module.exports = router;