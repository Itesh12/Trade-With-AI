const { connectToDatabase } = require('../config/db');
const logger = require('../utils/logger');

// Create a new transaction
exports.createTransaction = (transactionData, callback) => {
    const sql = `
        INSERT INTO transactions 
        (userId, planId, promoCodeId, amount, discountAmount, transactionDate, paymentStatus, paymentMethod, referenceId, originalPlanPrice, discountApplied)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [
        transactionData.userId,
        transactionData.planId,
        transactionData.promoCodeId,
        transactionData.amount,
        transactionData.discountAmount,
        transactionData.transactionDate,
        transactionData.paymentStatus,
        transactionData.paymentMethod,
        transactionData.referenceId,
        transactionData.originalPlanPrice,
        transactionData.discountApplied,
    ];

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { id: results.insertId, ...transactionData });
        });
    });
};

// Get a transaction by ID
exports.getTransactionById = (transactionId, callback) => {
    const sql = `SELECT * FROM transactions WHERE transactionId = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [transactionId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results[0]);
        });
    });
};

// Get all transactions
exports.getAllTransactions = (callback) => {
    const sql = `SELECT * FROM transactions`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};

// Update a transaction
exports.updateTransaction = (transactionId, transactionData, callback) => {
    const sql = `
        UPDATE transactions SET 
            userId = ?, 
            planId = ?, 
            promoCodeId = ?, 
            amount = ?, 
            discountAmount = ?, 
            transactionDate = ?, 
            paymentStatus = ?, 
            paymentMethod = ?, 
            referenceId = ?, 
            originalPlanPrice = ?, 
            discountApplied = ?
        WHERE transactionId = ?;
    `;
    const values = [
        transactionData.userId,
        transactionData.planId,
        transactionData.promoCodeId,
        transactionData.amount,
        transactionData.discountAmount,
        transactionData.transactionDate,
        transactionData.paymentStatus,
        transactionData.paymentMethod,
        transactionData.referenceId,
        transactionData.originalPlanPrice,
        transactionData.discountApplied,
        transactionId,
    ];

    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { ...transactionData, transactionId });
        });
    });
};

// Delete a transaction
exports.deleteTransaction = (transactionId, callback) => {
    const sql = `DELETE FROM transactions WHERE transactionId = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [transactionId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};
