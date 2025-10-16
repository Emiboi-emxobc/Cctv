// models/Visit.js
const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  referralCode: { type: String }, // e.g. EH0HS608
  ip: { type: String },
  path: { type: String }, // page they visited
  userAgent: { type: String }, // browser/device info
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visit", visitSchema);