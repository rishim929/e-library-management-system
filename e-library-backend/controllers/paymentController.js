const db = require("../config/db");
const axios = require("axios");

// ================= ADMIN PAYMENT HISTORY =================
exports.getAllPayments = (req, res) => {
  const sql = `
    SELECT
      payments.id,
      users.name,
      users.email,
      payments.amount,
      payments.payment_method,
      payments.transaction_id,
      payments.status,
      payments.payment_date
    FROM payments
    JOIN users
      ON payments.user_id = users.id
    ORDER BY payments.payment_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

// ================= INITIATE KHALTI PAYMENT =================
exports.initiatePayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      amount,
      purchase_order_id,
      purchase_order_name,
    } = req.body;

    const payload = {
      return_url: "http://localhost:5173/payment/success",
      website_url: "http://localhost:5173",
      amount,
      purchase_order_id,
      purchase_order_name,
    };

    // ================= DEBUG =================
    console.log("==================================");
    console.log("KHALTI_SECRET_KEY:", process.env.KHALTI_SECRET_KEY);
    console.log("KHALTI_INITIATE_URL:", process.env.KHALTI_INITIATE_URL);
    console.log("Payload:", payload);
    console.log("==================================");

    const response = await axios.post(
      process.env.KHALTI_INITIATE_URL,
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Khalti Response:");
    console.log(response.data);

    res.json({
      success: true,
      userId,
      data: response.data,
    });

  } catch (err) {
    console.log("========== KHALTI ERROR ==========");
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
    console.log("Message:", err.message);
    console.log("==================================");

    res.status(500).json({
      success: false,
      message: "Unable to initiate Khalti payment.",
      error: err.response?.data || err.message,
    });
  }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;
    const userId = req.user.id;

    const response = await axios.post(
      process.env.KHALTI_LOOKUP_URL,
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = response.data;

    if (
      payment.status !== "Completed" &&
      payment.status !== "Completed Successfully"
    ) {
      return res.status(400).json({
        message: "Payment not completed.",
      });
    }

    db.query(
      `
      INSERT INTO payments
      (
        user_id,
        amount,
        payment_method,
        transaction_id,
        pidx,
        status,
        payment_date
      )
      VALUES
      (?, ?, 'Khalti', ?, ?, ?, NOW())
      `,
      [
        userId,
        payment.total_amount / 100,
        payment.transaction_id || "",
        pidx,
        payment.status,
      ],
      (err) => {
        if (err) return res.status(500).json(err);

        db.query(
          "UPDATE users SET membership_type='premium' WHERE id=?",
          [userId],
          (err2) => {
            if (err2) return res.status(500).json(err2);

            db.query(
              `
              INSERT INTO subscriptions
              (
                user_id,
                plan_name,
                membership_type,
                start_date,
                end_date,
                status
              )
              VALUES
              (
                ?,
                'Premium Plan',
                'premium',
                CURDATE(),
                DATE_ADD(CURDATE(), INTERVAL 30 DAY),
                'active'
              )
              `,
              [userId],
              (err3) => {
                if (err3) return res.status(500).json(err3);

                res.json({
                  success: true,
                  message: "Premium activated successfully.",
                });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.log("========== VERIFY ERROR ==========");
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
    console.log("Message:", err.message);
    console.log("==================================");

    res.status(500).json({
      success: false,
      message: "Payment verification failed.",
      error: err.response?.data || err.message,
    });
  }
};