// require("dotenv").config();
// const mysql = require("mysql2");

//  Debug: Log DB config
// console.log("Connecting to MySQL with:");
// console.log({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS ? "(provided)" : "(empty)",
//   database: process.env.DB_NAME,
// });

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ DB connection failed:", err.message);
//   } else {
//     console.log("✅ Connected to MySQL database");
//   }
// });

// module.exports = db;

// require('dotenv').config();
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

//  yaha `.promise()` lagana hai
// module.exports = pool.promise();



require("dotenv").config();
const mysql = require("mysql2");

// Debug: Log DB config
console.log("Connecting to MySQL with:");
console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "(provided)" : "(empty)",
  database: process.env.DB_NAME,
});

// Connection pool with promise support
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release();
  }
});

module.exports = pool.promise();
