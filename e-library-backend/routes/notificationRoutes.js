const express = require("express");
const router = express.Router();

const {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
} = require("../controllers/notificationController");

// TEMPORARILY REMOVE verifyToken & isAdmin
router.get("/", getNotifications);
router.get("/count", getUnreadCount);
router.put("/read-all", markAllAsRead);

module.exports = router;