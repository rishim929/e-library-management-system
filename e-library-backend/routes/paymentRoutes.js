const express = require("express");
const router = express.Router();

const {
  getAllPayments,
} = require("../controllers/paymentController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Admin - View all payments
router.get("/", verifyToken, isAdmin, getAllPayments);

module.exports = router;