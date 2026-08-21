const nodemailer = require("nodemailer");

function getTransporter() {
  const host = process.env.MAIL_HOST || process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.MAIL_PORT || process.env.SMTP_PORT) || 587;
  const user = process.env.MAIL_USER || process.env.SMTP_USER;
  const pass = (process.env.MAIL_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

const sendWelcomeEmail = async (name, email) => {
  try {
    const transporter = getTransporter();
    const from = process.env.MAIL_FROM || `"E-Library" <${process.env.SMTP_USER || process.env.MAIL_USER}>`;

    await transporter.sendMail({
      from,
      to: email,
      subject: "📚 Welcome to E-Library",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h1 style="color: #16a34a; margin-top: 0;">Welcome to E-Library 📚</h1>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for registering at <strong>E-Library</strong>.</p>
        <p>Your account has been created successfully.</p>
        <h3>You can now:</h3>
        <ul>
          <li>📚 Browse Books</li>
          <li>📖 Read Basic Books</li>
          <li>⭐ Upgrade to Premium</li>
        </ul>
        <br>
        <a href="http://localhost:5173" style="background: #16a34a; color: white; padding: 12px 22px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit E-Library</a>
        <br><br>
        <p>Happy Reading ❤️</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px;">E-Library Team</p>
      </div>
      `,
    });

    console.log("Welcome Email Sent to:", email);
  } catch (err) {
    console.log("Email Error:", err);
  }
};

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = getTransporter();
    const from = process.env.MAIL_FROM || `"E-Library" <${process.env.SMTP_USER || process.env.MAIL_USER}>`;

    await transporter.sendMail({
      from,
      to: email,
      subject: "🔑 E-Library Password Reset OTP",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #16a34a; margin-top: 0; text-align: center;">E-Library Password Reset</h2>
        <p style="font-size: 16px; color: #334155;">Hello,</p>
        <p style="font-size: 16px; color: #334155;">You requested to reset your password. Use the following 6-digit OTP code to complete your password reset:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #16a34a; background-color: #f0fdf4; padding: 12px 28px; border: 2px dashed #16a34a; border-radius: 8px; display: inline-block;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #64748b;">This OTP code is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 30px;">
        <p style="color: #94a3b8; font-size: 13px; text-align: center;">E-Library Team</p>
      </div>
      `,
    });

    console.log("OTP Email Sent to:", email);
  } catch (err) {
    console.log("OTP Email Error:", err);
    throw err;
  }
};

const sendSubscriptionEmail = async (name, email, planName = "Premium Plan", amount = 20) => {
  try {
    const transporter = getTransporter();
    const from = process.env.MAIL_FROM || `"E-Library" <${process.env.SMTP_USER || process.env.MAIL_USER}>`;

    await transporter.sendMail({
      from,
      to: email,
      subject: "⭐ Subscription Activated - Welcome to E-Library Premium!",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
        <h1 style="color: #16a34a; margin-top: 0; text-align: center;">Subscription Activated! ⭐</h1>
        <p style="font-size: 16px; color: #334155;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #334155; line-height: 1.6;">
          Congratulations! You now have an active subscription to <strong>E-Library</strong>.
        </p>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #15803d;">Subscription Summary</h3>
          <p style="margin: 6px 0; color: #334155;"><strong>Plan:</strong> ${planName}</p>
          <p style="margin: 6px 0; color: #334155;"><strong>Amount Paid:</strong> Rs. ${amount}</p>
          <p style="margin: 6px 0; color: #334155;"><strong>Duration:</strong> 30 Days</p>
          <p style="margin: 6px 0; color: #334155;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Active</span></p>
        </div>
        <p style="font-size: 16px; color: #334155;">
          You can now read all premium books and access exclusive digital resources!
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="http://localhost:5173/user/books" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Start Reading Premium Books</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 30px;">
        <p style="color: #94a3b8; font-size: 13px; text-align: center;">Thank you for subscribing,<br><strong>E-Library Team</strong></p>
      </div>
      `,
    });

    console.log("Subscription Email Sent to:", email);
  } catch (err) {
    console.log("Subscription Email Error:", err);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOTPEmail,
  sendSubscriptionEmail,
};