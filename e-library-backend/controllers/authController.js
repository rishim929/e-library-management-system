const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
INSERT INTO users
(name, email, password, role, membership_type)
VALUES (?, ?, ?, 'subscriber', 'basic')
`;

  db.query(sql, [name, email, hashedPassword], (err) => {
    if (err) return res.json({ error: err });

    res.json({ message: "User registered successfully" });
  });
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.json({ error: err });

    if (results.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Wrong password" });
    }

const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({
      message: "Login successful",
      token,
      user
    });
  });
};