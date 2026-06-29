const db = require("../config/db");

// GET ALL USERS
exports.getUsers = (req, res) => {
  const sql = "SELECT id, name, email, role, membership_type, preferred_category, created_at FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

// UPDATE USER
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { role, membership_type } = req.body;

  const sql = `
    UPDATE users 
    SET role = ?, membership_type = ?
    WHERE id = ?
  `;

  db.query(sql, [role, membership_type, id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({ message: "User updated successfully" });
  });
};

// DELETE USER
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({ message: "User deleted successfully" });
  });
};