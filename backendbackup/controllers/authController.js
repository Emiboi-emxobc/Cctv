const User = require('../models/User');
const { generateReferralCode } = require('../utils/referral');
const jwt = require('jsonwebtoken');
const { notifyAdmin } = require('../utils/whatsapp');
const axios = require('axios');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, phone, apikey, password, referredBy } = req.body;
    

    // ✅ Validate required fields
    if (!firstname || !lastname || !phone || !password || !apikey) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // ✅ Check if user exists
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'User already exists'});

    // ✅ Generate referral code
    const referralCode = generateReferralCode(firstname, lastname);

    // ✅ Hash password
    

    // ✅ Create new user
    const user = await User.create({
      firstname,
      lastname,
      phone,
      apikey,
      password: password,
      referralCode,
      referredBy: referredBy || null,
      referrals: []
    });

    // ✅ Handle referrer if exists
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.referrals.push(user.referralCode);
        await referrer.save();
      }
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // ✅ Check user exists
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // ✅ Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: `Incorrect password! `});

    // ✅ Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // ensure subscription active flag updated if expired
    if (user.subscription && user.subscription.active && user.subscription.endDate) {
      if (new Date() > new Date(user.subscription.endDate)) {
        user.subscription.active = false;
        await user.save();
      }
    }

    // ✅ Return safe user info
    const userSafe = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      referralCode: user.referralCode || null,
      subscription: user.subscription || null
    };

    // If login came from a referral flow, notify admins via WhatsApp (if configured)
    try {
      const fromReferral = req.body && (req.body.referralLogin || req.body.referralCode);
      if (fromReferral && process.env.SEND_WHATSAPP_ON_REFERRAL === 'true') {
        const message = `Referral login: ${user.firstname} ${user.lastname} (${user.phone}). Referral: ${req.body.referralCode || 'n/a'}`;
        notifyAdmin(message).catch(e=>console.error('WhatsApp notify failed', e));
      }
    } catch(e){ console.error('notify check failed', e); }

    res.json({ message: 'Login successful', token, user: userSafe });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
  
};