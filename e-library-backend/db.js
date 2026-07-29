const mysql = require("mysql2");

console.log("Attempting DB connection with host:", process.env.MYSQLHOST);

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "e_library",
    port: process.env.MYSQLPORT || 3306,
    connectTimeout: 10000
});

db.connect((err) => {
    if (err) {
        console.log("DB connection failed:", err.message);
    } else {
        console.log("MySQL Connected!");
    }
});

module.exports = db;