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

// Admin
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Logged-in User
router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);

module.exports = router;