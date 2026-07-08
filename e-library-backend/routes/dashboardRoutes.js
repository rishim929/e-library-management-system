const express = require("express");
const router = express.Router();

const db = require("../config/db");

// 📚 Total Books
router.get("/books", (req, res) => {
  db.query("SELECT COUNT(*) AS totalBooks FROM books", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

// 📂 Total Categories
router.get("/categories", (req, res) => {
  db.query(
    "SELECT COUNT(*) AS totalCategories FROM categories",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// 👥 Total Users
router.get("/users", (req, res) => {
  db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

// 💎 Premium Users
router.get("/premium-users", (req, res) => {
  db.query(
    "SELECT COUNT(*) AS premiumUsers FROM users WHERE membership_type='premium'",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// 🟢 Active Subscriptions
router.get("/subscriptions", (req, res) => {
  db.query(
    "SELECT COUNT(*) AS activeSubscriptions FROM subscriptions WHERE status='active'",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

module.exports = router;