const express = require("express");
const router = express.Router();

const {
  getSubscriptions,
  upgradeSubscription,
} = require("../controllers/subscriptionController");

const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getSubscriptions);
router.post("/upgrade", verifyToken, upgradeSubscription);

module.exports = router;