const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
destination: (req, file, cb) => {
  let uploadPath;

  if (file.fieldname === "pdf") {
    uploadPath = path.join(__dirname, "../uploads/pdfs");
  } else if (file.fieldname === "cover") {
    uploadPath = path.join(__dirname, "../uploads/covers");
  } else {
    return cb(new Error("Invalid field name"));
  }

  cb(null, uploadPath);
},

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "pdf") {
    if (ext === ".pdf") {
      return cb(null, true);
    }
    return cb(new Error("Only PDF files are allowed for the PDF field."));
  }

  if (file.fieldname === "cover") {
    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(null, true);
    }
    return cb(
      new Error("Only JPG, JPEG and PNG files are allowed for the cover image.")
    );
  }

  cb(new Error("Unexpected file field."));
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = { upload };