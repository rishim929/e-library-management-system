const db = require("../config/db");

// ADD BOOK
exports.addBook = (req, res) => {
  const {
    title,
    author,
    category_id,
    membership_level,
  } = req.body;

  const pdf = req.files?.pdf?.[0]?.filename || null;
  const cover = req.files?.cover?.[0]?.filename || null;

  const sql = `
    INSERT INTO books 
    (title, author, category_id, membership_level, pdf, cover)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, author, category_id, membership_level, pdf, cover],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Book added successfully" });
    }
  );
};