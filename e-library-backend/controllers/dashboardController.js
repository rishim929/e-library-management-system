const db = require("../config/db");

// Total Books
exports.getBookCount = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS totalBooks FROM books",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    }
  );
};

// Total Categories
exports.getCategoryCount = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS totalCategories FROM categories",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    }
  );
};

// Total Users
exports.getUserCount = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS totalUsers FROM users",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    }
  );
};

// Premium Users
exports.getPremiumUsers = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS premiumUsers FROM users WHERE membership_type='premium'",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    }
  );
};

// Active Subscriptions
exports.getActiveSubscriptions = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS activeSubscriptions FROM subscriptions WHERE status='active'",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    }
  );
};