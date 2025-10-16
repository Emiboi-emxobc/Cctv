// backend/models/visit.js
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  path: String,
  referrer: String,       // referral code that brought visitor (if any)
  ip: String,
  userAgent: String,
  utm: Object,            // optional UTM parameters
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', visitSchema);