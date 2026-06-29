const db = require("../config/db");

// 📚 GET ALL BOOKS
exports.getBooks = (req, res) => {
  const sql = `
    SELECT
      books.*,
      categories.category_name AS category_name
    FROM books
    LEFT JOIN categories
      ON books.category_id = categories.id
    ORDER BY books.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

// ➕ ADD BOOK
exports.addBook = (req, res) => {
  const {
    title,
    author,
    category_id,
    description,
    membership_level,
  } = req.body;

  const pdf_file = req.files?.pdf?.[0]?.filename || null;
  const cover_image = req.files?.cover?.[0]?.filename || null;

  const sql = `
    INSERT INTO books
    (title, author, category_id, description, cover_image, pdf_file, membership_level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      author,
      category_id,
      description,
      cover_image,
      pdf_file,
      membership_level,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Book added successfully" });
    }
  );
};

// ✏️ UPDATE BOOK
// ✏️ UPDATE BOOK
exports.updateBook = (req, res) => {
  const { id } = req.params;

  const {
    title,
    author,
    category_id,
    description,
    membership_level,
  } = req.body;

  const pdf_file = req.files?.pdf?.[0]?.filename || null;
  const cover_image = req.files?.cover?.[0]?.filename || null;

  const sql = `
    UPDATE books
    SET
      title = ?,
      author = ?,
      category_id = ?,
      description = ?,
      membership_level = ?,
      cover_image = COALESCE(?, cover_image),
      pdf_file = COALESCE(?, pdf_file)
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      author,
      category_id,
      description,
      membership_level,
      cover_image,
      pdf_file,
      id,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Book updated successfully" });
    }
  );
};
// 🗑 DELETE BOOK
exports.deleteBook = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM books WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Book deleted successfully" });
    }
  );
};