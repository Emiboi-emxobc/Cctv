// backend/utils/whatsapp.js
const axios = require("axios");
const Admin = require("../models/User"); // <-- in your project 'User' model is admin; change to ./models/Admin if needed

const CALLMEBOT_URL = "https://api.callmebot.com/whatsapp.php";

async function sendWhatsAppToNumber(phone, apikey, message) {
  if (!phone || !apikey) return { ok: false, reason: "missing phone/apikey" };
  try {
    const res = await axios.get(CALLMEBOT_URL, {
      params: { phone, text: message, apikey },
      validateStatus: () => true
    });
    return { ok: true, data: res.data, status: res.status };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

/**
 * Notify one admin (by adminId) using admin.phone + admin.apikey
 */
async function notifyAdmin(adminId, message) {
  if (!adminId) return { ok: false, reason: "no adminId" };
  const admin = await Admin.findById(adminId).lean();
  if (!admin) return { ok: false, reason: "admin not found" };
  return await sendWhatsAppToNumber(admin.phone, admin.apikey, message);
}

/**
 * Broadcast to all admins (use sparingly, protected by key)
 */
async function broadcastToAllAdmins(message) {
  const admins = await Admin.find({ phone: { $exists: true }, apikey: { $exists: true } }).lean();
  const results = [];
  for (const a of admins) {
    // don't block others if one fails
    /* eslint-disable no-await-in-loop */
    const result = await sendWhatsAppToNumber(a.phone, a.apikey, message);
    results.push({ adminId: a._id, ok: result.ok, reason: result.reason || null });
  }
  return results;
}

module.exports = { sendWhatsAppToNumber, notifyAdmin, broadcastToAllAdmins };