const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  apikey: { type: String, required: true },
  password: { type: String, required: true },
  referralCode: { type: String },
  referredBy: { type: String },
  referrals: [{ type: String }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
