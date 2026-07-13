const express = require("express");
const router = express.Router();

const {
  getSubscriptions,
  upgradeSubscription,
} = require("../controllers/subscriptionController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Admin only
router.get("/", verifyToken, isAdmin, getSubscriptions);

// Logged in user
router.post("/upgrade", verifyToken, upgradeSubscription);

module.exports = router;