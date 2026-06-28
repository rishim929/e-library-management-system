const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 
  // format: Bearer token

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      return res.json({ message: "Invalid token" });
    }

    req.user = decoded; // store user info (id, role)
    next();
  });
};

module.exports = verifyToken;