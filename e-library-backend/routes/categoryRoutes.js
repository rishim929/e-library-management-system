const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Everyone can view categories
router.get("/", categoryController.getCategories);

// Admin only
router.post(
  "/",
  verifyToken,
  isAdmin,
  categoryController.addCategory
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;