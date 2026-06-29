const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { upload } = require("../middleware/upload");

// GET all books
router.get("/", getBooks);

// ADD book
router.post(
  "/",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  addBook
);

// UPDATE book
router.put(
  "/:id",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateBook
);

// DELETE book
router.delete("/:id", deleteBook);

module.exports = router;