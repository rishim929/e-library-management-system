const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} = require("../controllers/paymentController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Admin - View all payments
router.get("/", verifyToken, isAdmin, getAllPayments);

// Khalti
router.post("/khalti/initiate", verifyToken, initiateKhaltiPayment);
router.post("/khalti/verify", verifyToken, verifyKhaltiPayment);

module.exports = router;