// backend/models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  title: String,
   description: String,
  profileName: String,
  platforms :{type:String,defaul:["Facebook","Instagram"]},
  premiumPrices: {
    weekly: Number,
    monthly: Number,
    yearly: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);