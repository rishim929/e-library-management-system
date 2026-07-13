const express = require("express");
const router = express.Router();

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { upload } = require("../middleware/upload");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Everyone can view books
router.get("/", getBooks);

// Only admin can add book
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  addBook
);

// Only admin can update book
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateBook
);

// Only admin can delete book
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteBook
);

module.exports = router;