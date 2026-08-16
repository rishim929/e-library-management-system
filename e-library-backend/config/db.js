const mysql = require("mysql2");
require("dotenv").config();

const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || "localhost";
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || "root";
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "";
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || "elibrary_db";
const dbPort = process.env.DB_PORT || process.env.MYSQLPORT || 3306;

console.log("Attempting DB connection with host:", dbHost, "port:", dbPort, "database:", dbName);

const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: Number(dbPort),
  connectTimeout: 10000,
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err.message);
  } else {
    console.log("MySQL Connected Successfully!");
  }
});

module.exports = db;