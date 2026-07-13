const db = require("../config/db");

// Save reading history
exports.saveReadingHistory = (req, res) => {
  console.log("========== SAVE READING HISTORY ==========");
  console.log("User:", req.user);
  console.log("Body:", req.body);

  const userId = req.user.id;
  const { book_id, last_page } = req.body;

  const sql = `
    INSERT INTO reading_history
    (user_id, book_id, last_page)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
    last_page = VALUES(last_page),
    last_opened = CURRENT_TIMESTAMP
  `;

  db.query(sql, [userId, book_id, last_page], (err, result) => {
    if (err) {
      console.log("MYSQL ERROR:");
      console.log(err);

      return res.status(500).json({
        success: false,
        error: err,
      });
    }

    console.log("Saved Successfully");
    console.log(result);

    res.json({
      success: true,
      message: "Reading history saved successfully",
    });
  });
};

// Get logged-in user's reading history
// Get logged-in user's reading history
exports.getMyReadingHistory = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      rh.id,
      rh.book_id,
      rh.last_page,
      rh.last_opened,

      b.title,
      b.author,
      b.cover_image,
      b.pdf_file,
      b.membership_level

    FROM reading_history rh
    JOIN books b
      ON rh.book_id = b.id

    WHERE rh.user_id = ?

    ORDER BY rh.last_opened DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};