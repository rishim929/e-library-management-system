const express = require("express");
const router = express.Router();

const {
  getUsers,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/userController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Admin only
router.get("/", verifyToken, isAdmin, getUsers);
router.put("/:id", verifyToken, isAdmin, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

// Logged in user
router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);

module.exports = router;