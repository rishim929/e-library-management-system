const express = require("express");
const router = express.Router();

const db = require("../config/db");

// 📊 Total Books
router.get("/books", (req, res) => {
  db.query("SELECT COUNT(*) AS totalBooks FROM books", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

// 📊 Total Categories
router.get("/categories", (req, res) => {
  db.query("SELECT COUNT(*) AS totalCategories FROM categories", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

module.exports = router;