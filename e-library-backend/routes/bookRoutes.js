const express = require("express");
const router = express.Router();

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const { upload } = require("../middleware/upload");

router.post(
  "/",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  addBook
);

// 📚 UPDATE book
router.put(
  "/:id",
  uploadPdf.single("pdf"),
  uploadCover.single("cover"),
  updateBook
);

// 📚 DELETE book
router.delete("/:id", deleteBook);

module.exports = router;