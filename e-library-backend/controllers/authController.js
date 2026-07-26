const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail, sendOTPEmail } = require("../services/mailService");

// Auto-migration helper: ensure reset_otp columns exist in users table
const ensureOTPColumns = () => {
  db.query("SHOW COLUMNS FROM users LIKE 'reset_otp'", (err, results) => {
    if (!err && results.length === 0) {
      db.query(
        "ALTER TABLE users ADD COLUMN reset_otp VARCHAR(10) DEFAULT NULL, ADD COLUMN reset_otp_expires DATETIME DEFAULT NULL",
        (alterErr) => {
          if (alterErr) console.log("Column Migration Warning:", alterErr.message);
          else console.log("OTP columns added to users table.");
        }
      );
    }
  });
};
ensureOTPColumns();

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO users
    (name, email, password, role, membership_type)
    VALUES (?, ?, ?, 'subscriber', 'basic')
  `;

  db.query(sql, [name, email, hashedPassword], async (err) => {
    if (err) {
      console.log(err);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      return res.status(500).json({
        message: "Registration failed",
      });
    }

    // ================= CREATE NOTIFICATION =================
    db.query(
      `
      INSERT INTO notifications
      (title, message, type)
      VALUES (?, ?, ?)
      `,
      [
        "New User Registration",
        `${name} has registered a new account.`,
        "user",
      ],
      (notifyErr) => {
        if (notifyErr) {
          console.log("Notification Error:", notifyErr);
        }
      }
    );

    // ================= SEND WELCOME EMAIL =================
    try {
      await sendWelcomeEmail(name, email);
      console.log("Welcome email sent successfully.");
    } catch (mailErr) {
      console.log("Welcome email error:", mailErr);
    }

    res.json({
      message: "User registered successfully",
    });
  });
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = results[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  });
};

// ================= FORGOT PASSWORD (REQUEST OTP) =================
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 10 minutes
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const updateSql = "UPDATE users SET reset_otp = ?, reset_otp_expires = ? WHERE email = ?";
    db.query(updateSql, [otp, expires, email], async (updateErr) => {
      if (updateErr) {
        console.log(updateErr);
        return res.status(500).json({ message: "Failed to generate OTP" });
      }

      try {
        await sendOTPEmail(email, otp);
        return res.json({ message: "OTP sent to your email successfully" });
      } catch (mailErr) {
        console.log("OTP Email send failed:", mailErr);
        return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
      }
    });
  });
};

// ================= VERIFY OTP =================
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND reset_otp = ? AND reset_otp_expires > NOW()";
  db.query(sql, [email, otp], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    return res.json({ message: "OTP verified successfully" });
  });
};

// ================= RESET PASSWORD =================
exports.resetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkSql = "SELECT * FROM users WHERE email = ? AND reset_otp = ? AND reset_otp_expires > NOW()";
  db.query(checkSql, [email, otp], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP session. Please request a new OTP." });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updateSql = "UPDATE users SET password = ?, reset_otp = NULL, reset_otp_expires = NULL WHERE email = ?";

    db.query(updateSql, [hashedPassword, email], (updateErr) => {
      if (updateErr) {
        console.log(updateErr);
        return res.status(500).json({ message: "Failed to update password" });
      }

      return res.json({ message: "Password reset successfully. You can now login with your new password." });
    });
  });
};