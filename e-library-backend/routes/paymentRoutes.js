const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  initiatePayment,
  verifyPayment,
} = require("../controllers/paymentController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// ================= USER ROUTES =================

// Initiate Khalti Payment
router.post("/initiate", verifyToken, initiatePayment);

// Verify Khalti Payment
router.post("/verify", verifyToken, verifyPayment);

// ================= ADMIN ROUTES =================

// View Payment History
router.get("/", verifyToken, isAdmin, getAllPayments);

module.exports = router;