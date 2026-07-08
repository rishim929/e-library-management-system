const db = require("../config/db");

// ================= GET ALL SUBSCRIPTIONS =================
exports.getSubscriptions = (req, res) => {
  const sql = `
    SELECT
      s.*,
      u.name,
      u.email
    FROM subscriptions s
    JOIN users u
      ON s.user_id = u.id
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

// ================= UPGRADE CURRENT USER =================
exports.upgradeSubscription = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM subscriptions WHERE user_id=? AND status='active'",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (results.length > 0) {
        return res.json({
          message: "You already have an active Premium subscription.",
        });
      }

      db.query(
        "UPDATE users SET membership_type='premium' WHERE id=?",
        [userId],
        (err2) => {
          if (err2) {
            return res.status(500).json(err2);
          }

          db.query(
            `INSERT INTO subscriptions
            (user_id, plan_name, membership_type, start_date, end_date, status)
            VALUES
            (?, 'Premium Plan', 'premium', CURDATE(),
            DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'active')`,
            [userId],
            (err3) => {
              if (err3) {
                return res.status(500).json(err3);
              }

              res.json({
                message: "Subscription upgraded successfully",
              });
            }
          );
        }
      );
    }
  );
};