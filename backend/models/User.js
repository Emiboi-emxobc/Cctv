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

  // 🔥 Subscription Info
  subscription: {
    plan: { 
      type: String, 
      enum: ['free', 'weekly', 'monthly', 'yearly'], 
      default: 'free' 
    },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: false },
  },
}, { timestamps: true });

// Hash password only if it's new or modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 💡 Helper: check if subscription expired
userSchema.methods.isSubscriptionActive = function () {
  if (!this.subscription || !this.subscription.endDate) return false;
  const now = new Date();
  return this.subscription.active && now < this.subscription.endDate;
};

// 💡 Helper: auto-deactivate expired subs
userSchema.methods.checkAndDeactivateSubscription = async function () {
  if (this.subscription.active && new Date() > this.subscription.endDate) {
    this.subscription.active = false;
    this.subscription.plan = 'free';
    await this.save();
  }
};

module.exports = mongoose.model('User', userSchema);