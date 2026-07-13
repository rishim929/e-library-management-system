const db = require("../config/db");

// Get all notifications
exports.getNotifications = (req, res) => {
  const sql = `
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

// Get unread count
exports.getUnreadCount = (req, res) => {
  db.query(
    "SELECT COUNT(*) AS count FROM notifications WHERE is_read = 0",
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json(results[0]);
    }
  );
};

// Mark all notifications as read
exports.markAllAsRead = (req, res) => {
  db.query(
    "UPDATE notifications SET is_read = 1",
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "All notifications marked as read",
      });
    }
  );
};