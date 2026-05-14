const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('\x1b[31m✗  MySQL Connection Failed:\x1b[0m', err.message);
    return;
  }
  console.log('\x1b[32m✓  MySQL Connected Successfully\x1b[0m');
  connection.release();
});

module.exports = db;
