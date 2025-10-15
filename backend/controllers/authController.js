const User = require('../models/User');
const { generateReferralCode } = require('../utils/referral');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, phone, apikey, password, referredBy } = req.body;
    console.log(firstname, lastname, phone, apikey, password)

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

    // ✅ Return safe user info only
    const { firstname, lastname, phone: userPhone, referralCode } = user;

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};