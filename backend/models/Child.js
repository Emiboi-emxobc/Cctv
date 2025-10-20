// models/Child.js
const mongoose = require("mongoose");

const ChildSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
  type: String,
  unique: true,
  required: false, // or remove required
  sparse: true    // important: allows multiple nulls
}, // optional now
  password: { type: String, required: true },
  referralCode: { type: String, default: "direct" },
  platform: { type: String } // optional, but captured if sent
}, { timestamps: true });

module.exports = mongoose.model("Child", ChildSchema);
