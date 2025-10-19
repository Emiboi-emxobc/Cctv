// backend/routes/subscriptionRoute.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/sub/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { phone, plan, weeks } = req.body; // weeks optional override for testing
    if (!phone || !plan) return res.status(400).json({ success:false, message: 'phone and plan required' });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success:false, message: 'User not found' });

    const now = new Date();
    let end;
    if (plan === 'weekly') end = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000) * (weeks || 1));
    else if (plan === 'monthly') end = new Date(now.setMonth(now.getMonth() + (weeks || 1)));
    else if (plan === 'yearly') end = new Date(now.setFullYear(now.getFullYear() + 1));
    else return res.status(400).json({ success:false, message: 'Invalid plan' });

    user.subscription = {
      plan,
      startDate: new Date(),
      endDate: end,
      active: true
    };
    await user.save();
    res.json({ success: true, message: 'Subscription active', subscription: user.subscription });
  } catch (err) {
    console.error('Subscription error:', err.message);
    res.status(500).json({ success:false, message: 'Server error' });
  }
});

// GET /api/sub/check/:phone
router.get('/check/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success:false, message: 'User not found' });
    const active = user.isSubscriptionActive ? user.isSubscriptionActive() : !!(user.subscription && user.subscription.active);
    res.json({ success:true, active, subscription: user.subscription || null });
  } catch (err) {
    res.status(500).json({ success:false, message: 'Server error' });
  }
});

module.exports = router;