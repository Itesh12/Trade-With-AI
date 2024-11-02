// config/db.js
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10, // Adjust based on your load
});

function connectToDatabase(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            callback(err);
        } else {
            console.log('MySQL pool connected!');
            callback(null, connection);
        }
    });
}

module.exports = { pool, connectToDatabase };
