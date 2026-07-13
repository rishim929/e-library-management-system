const express = require("express");
const router = express.Router();

const {
  saveReadingHistory,
  getMyReadingHistory,
} = require("../controllers/readingHistoryController");

const { verifyToken } = require("../middleware/authMiddleware");

// Save reading history
router.post("/", verifyToken, saveReadingHistory);

// Get logged-in user's reading history
router.get("/", verifyToken, getMyReadingHistory);

module.exports = router;