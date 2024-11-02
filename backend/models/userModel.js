// models/userModel.js
const { connectToDatabase } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (userData) => {
    const { firstName, lastName, email, password, ...defaultValues } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
        INSERT INTO users 
        (firstName, lastName, email, password, profilePicture, dateOfBirth, address, mobilenumber, gender, role, premiumUser, status, premiumPurchaseDate, lastLogin, notificationStatus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(
                sql,
                [
                    firstName,
                    lastName,
                    email,
                    hashedPassword,
                    ...Object.values(defaultValues),
                ],
                (err, results) => {
                    connection.release();
                    if (err) return reject(err);
                    resolve({
                        id: results.insertId,
                        ...userData,
                        password: undefined,
                    });
                }
            );
        });
    });
};

exports.loginUser = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, [email], (err, results) => {
                connection.release();
                if (err || results.length === 0)
                    return reject(new Error('Invalid credentials'));
                resolve(results[0]);
            });
        });
    });
};

exports.updateUserToken = (userId, token) => {
    const sql = 'UPDATE users SET token = ? WHERE id = ?';

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, [token, userId], (err, results) => {
                connection.release();
                if (err) return reject(err);
                resolve(results);
            });
        });
    });
};

exports.getAllUsers = () => {
    const sql = 'SELECT * FROM users';

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, (err, results) => {
                connection.release();
                if (err) return reject(err);
                resolve(
                    results.map(
                        ({ password, ...userWithoutPassword }) =>
                            userWithoutPassword
                    )
                );
            });
        });
    });
};

exports.getUserById = (userId) => {
    const sql = 'SELECT * FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, [userId], (err, results) => {
                connection.release();
                if (err || results.length === 0)
                    return reject(new Error('User not found'));
                resolve(results[0]);
            });
        });
    });
};

exports.updateUser = (userId, updates) => {
    const setClause = Object.keys(updates)
        .map((field) => `${field} = ?`)
        .join(', ');
    const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
    const values = [...Object.values(updates), userId];

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, values, (err, results) => {
                connection.release();
                if (err) return reject(err);
                resolve(results);
            });
        });
    });
};

exports.deleteUser = (userId) => {
    const sql = 'DELETE FROM users WHERE id = ?';

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, [userId], (err, results) => {
                connection.release();
                if (err || results.affectedRows === 0)
                    return reject(new Error('User not found'));
                resolve(results);
            });
        });
    });
};

exports.updateLastLogin = (userId) => {
    const sql = 'UPDATE users SET lastLogin = ? WHERE id = ?';
    const currentTime = new Date();

    return new Promise((resolve, reject) => {
        connectToDatabase((err, connection) => {
            if (err) return reject(err);

            connection.query(sql, [currentTime, userId], (err, results) => {
                connection.release();
                if (err) return reject(err);
                resolve(results);
            });
        });
    });
};
