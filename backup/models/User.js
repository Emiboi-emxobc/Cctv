// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const subscriptionSchema = new mongoose.Schema({
  plan: { type: String, enum: ['free','weekly','monthly','yearly'], default: 'free' },
  startDate: { type: Date },
  endDate: { type: Date },
  active: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  apikey: { type: String, required: true },
  password: { type: String, required: true },
  referralCode: { type: String },
  referredBy: { type: String },
  referrals: [{ type: String }],
  subscription: { type: subscriptionSchema, default: () => ({}) }
}, { timestamps: true });

// Hash password only if new/modified
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isSubscriptionActive = function() {
  if (!this.subscription) return false;
  if (!this.subscription.active) return false;
  if (!this.subscription.endDate) return false;
  return new Date() < new Date(this.subscription.endDate);
};

module.exports = mongoose.model('User', userSchema);