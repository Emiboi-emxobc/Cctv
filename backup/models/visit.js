// backend/models/visit.js
const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  path: String,
  referrer: String,
  utm: String,
  ip: String,
  userAgent: String,
  signedUp: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" } // link to student
}, { timestamps: true });

module.exports = mongoose.model("Visit", VisitSchema);