const express = require("express");
const router = express.Router();
const { studentSignup, studentLogin } = require("../controllers/childrenController");

// POST /api/student/signup
router.post("/signup", studentSignup);

// POST /api/student/login
router.post("/login", studentLogin);

module.exports = router;