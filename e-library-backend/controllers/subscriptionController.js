const db = require("../config/db");

// Get all subscriptions (Admin)
exports.getSubscriptions = (req, res) => {
  const sql = `
    SELECT
      s.*,
      u.name,
      u.email
    FROM subscriptions s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

// Upgrade current user
exports.upgradeSubscription = (req, res) => {
  const userId = req.user.id;

  const sql1 = `
    UPDATE users
    SET membership_type='premium'
    WHERE id=?
  `;

  db.query(sql1, [userId], (err) => {
    if (err) return res.status(500).json(err);

    const sql2 = `
      INSERT INTO subscriptions
      (user_id, plan_name, membership_type, start_date, end_date, status)
      VALUES
      (?, 'Premium Plan', 'premium', CURDATE(),
      DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'active')
    `;

    db.query(sql2, [userId], (err2) => {
      if (err2) return res.status(500).json(err2);

      res.json({
        message: "Subscription upgraded successfully"
      });
    });
  });
};