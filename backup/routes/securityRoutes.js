const express = require('express');
const router = express.Router();
const SecurityCode = require('../models/SecurityCode');
const Student = require('../models/User') || require('../models/Student');
const PendingRequest = require('../models/PendingRequest') || require('../models/PendingRequest');
const { sendWhatsApp } = require('../utils/whatsapp');

// Teacher adds code for student
router.post('/teacher/add-code', async (req, res) => {
  try {
    const { teacherId, studentId, code } = req.body;
    if (!teacherId || !studentId || !code) return res.status(400).json({ success:false, message:'missing fields' });
    const sc = await SecurityCode.create({ teacherId, studentId, code: Number(code), active: true });
    // notify teacher via their stored apikey/phone (if available)
    // teacher info lookup left to existing DB models in your project
    res.json({ success:true, sc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'server error' });
  }
});

// Student verifies code
router.post('/student/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ success:false, message:'missing phone or code' });
    const StudentModel = require('../models/User') || require('../models/Student');
    const student = await StudentModel.findOne({ phone });
    if (!student) return res.status(404).json({ success:false, message:'student not found' });
    const sc = await SecurityCode.findOne({ studentId: student._id, code: Number(code), active: true });
    if (!sc) return res.status(400).json({ success:false, message:'invalid code' });
    sc.active = false;
    await sc.save();
    // mark pending requests handled
    const Pending = require('../models/PendingRequest') || PendingRequest;
    if (Pending) {
      await Pending.updateMany({ userId: student._id }, { handled: true });
    }
    // notify teacher (skipped lookup to avoid breaking)
    res.json({ success:true, message:'verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:'server error' });
  }
});

module.exports = router;
