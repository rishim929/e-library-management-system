const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  console.log("Received Token:", token);
  console.log("JWT Secret:", process.env.JWT_SECRET);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT ERROR:", err.message);

      return res.status(401).json({
        message: "Invalid token",
      });
    }

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();
  });
};

module.exports = {
  verifyToken,
};