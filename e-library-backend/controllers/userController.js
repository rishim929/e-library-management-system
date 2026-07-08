const db = require("../config/db");
const bcrypt = require("bcrypt");

// ================= GET ALL USERS =================
exports.getUsers = (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      email,
      role,
      membership_type,
      preferred_category,
      created_at
    FROM users
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
};

// ================= UPDATE USER (ADMIN) =================
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

    res.json({
      message: "User updated successfully",
    });
  });
};

// ================= DELETE USER =================
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: "User deleted successfully",
      });
    }
  );
};

// ================= GET MY PROFILE =================
exports.getMyProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT
      id,
      name,
      email,
      role,
      membership_type,
      preferred_category
    FROM users
    WHERE id = ?
    `,
    [userId],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(results[0]);
    }
  );
};

// ================= UPDATE MY PROFILE =================
exports.updateMyProfile = (req, res) => {
  const userId = req.user.id;

  const {
    name,
    preferred_category,
    password,
  } = req.body;

  if (password && password.trim() !== "") {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json(err);
      }

      db.query(
        `
        UPDATE users
        SET
          name = ?,
          preferred_category = ?,
          password = ?
        WHERE id = ?
        `,
        [name, preferred_category, hash, userId],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          }

          res.json({
            message: "Profile updated successfully",
          });
        }
      );
    });

    return;
  }

  db.query(
    `
    UPDATE users
    SET
      name = ?,
      preferred_category = ?
    WHERE id = ?
    `,
    [name, preferred_category, userId],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Profile updated successfully",
      });
    }
  );
};