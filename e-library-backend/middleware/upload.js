const multer = require("multer");
const path = require("path");

// Storage for PDF files
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pdfs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Storage for Cover Images
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/covers");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = /pdf|jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, PNG allowed"));
  }
}

// Upload configs
const uploadPdf = multer({ storage: pdfStorage, fileFilter });
const uploadCover = multer({ storage: coverStorage, fileFilter });

module.exports = {
  uploadPdf,
  uploadCover,
};