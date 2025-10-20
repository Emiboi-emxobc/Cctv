// models/Child.js
const mongoose = require("mongoose");

const ChildSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, default: "direct" } // the admin who referred them
}, { timestamps: true });

module.exports = mongoose.model("Child", ChildSchema);