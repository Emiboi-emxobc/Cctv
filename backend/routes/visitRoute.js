// routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const { trackVisit, getVisitsByReferral } = require("../controllers/visitController");

// POST - record visit
router.post("/", trackVisit);

// GET - list all visits under a specific referral
router.get("/:referralCode", getVisitsByReferral);

module.exports = router;