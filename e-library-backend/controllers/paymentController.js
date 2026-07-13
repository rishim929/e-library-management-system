const db = require("../config/db");

// Admin - Get all payments
exports.getAllPayments = (req, res) => {
  const sql = `
    SELECT
      payments.id,
      users.name,
      users.email,
      payments.amount,
      payments.payment_method,
      payments.transaction_id,
      payments.created_at
    FROM payments
    JOIN users
      ON payments.user_id = users.id
    ORDER BY payments.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};