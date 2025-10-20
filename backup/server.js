// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { broadcastToAllAdmins } = require("./utils/whatsapp");

const visitRoute = require("./routes/visitRoute");       // visit logging & stats
const studentRoute = require("./routes/studentRoute");   // signup/login router
const adminRoute = require("./routes/authRoutes");       // admin auth
const referralRoute = require("./routes/referralRoute"); // old feature

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB connection (new inline style)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/visit", visitRoute);
app.use("/api/student", studentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/referral", referralRoute); // old route maintained

/**
 * Protected broadcast route for global announcements.
 * Use header: x-admin-broadcast-key
 */
app.post("/api/notify/global", async (req, res) => {
  const secret = req.headers["x-admin-broadcast-key"];
  if (!process.env.ADMIN_BROADCAST_KEY || secret !== process.env.ADMIN_BROADCAST_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Message required" });

  const results = await broadcastToAllAdmins(text);
  res.json({ success: true, results });
});

// Health check
app.get("/", (req, res) => res.send("Server is running!"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🇳🇬Server🇳🇬🚀🚀🇺🇸🏅🏅🏅🤩🤩🥰 running on port ${PORT}`));