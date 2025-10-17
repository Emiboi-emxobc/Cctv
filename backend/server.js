// server.js (or your main app file)
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { broadcastToAllAdmins } = require("./utils/whatsapp");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

// your existing routes...
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/visits", require("./routes/visitRoutes"));

/**
 * Protected broadcast route for global announcements.
 * Use a header x-admin-broadcast-key: process.env.ADMIN_BROADCAST_KEY
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));