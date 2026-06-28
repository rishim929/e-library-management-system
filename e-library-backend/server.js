const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path"); // 👈 STEP 1: add this

const app = express();

// Database Connection
require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// 📌 STEP 6: Serve uploaded files (IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// 👆 this makes your images/PDF accessible in browser

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});