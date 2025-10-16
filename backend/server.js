// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🧠 Connect to MongoDB
connectDB();

// 🛣 Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/visits", require("./routes/visitRoutes"));

// 🏠 Default route
app.get("/", (req, res) => {
  res.json({ message: "You are highly welcome to Nexa backend 🚀🇳🇬" });
});

// ⚡ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));