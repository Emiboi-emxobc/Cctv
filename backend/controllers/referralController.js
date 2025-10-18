const User = require('../models/User');
const { generateReferralCode } = require('../utils/referral');

exports.createReferral = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success:false, message: 'phone required' });
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success:false, message: 'User not found' });

    // generate unique code (naive, but works)
    let code = generateReferralCode(user.firstname||'U', user.lastname||'X');
    // ensure uniqueness
    const exists = await User.findOne({ referralCode: code });
    if (exists) code = code + Math.random().toString(36).substring(2,5).toUpperCase();

    user.referralCode = code;
    await user.save();

    const link = (process.env.FRONTEND_BASE || '') + `/r/${code}`;
    res.json({ success:true, referral: { code, link } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: 'Server error' });
  }
};

exports.getOwnerByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findOne({ referralCode: code }).select('firstname lastname phone referralCode').lean();
    if (!user) return res.status(404).json({ success:false, message: 'Not found' });
    res.json({ success:true, owner: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: 'Server error' });
  }
};
