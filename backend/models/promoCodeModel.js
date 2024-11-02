const { connectToDatabase } = require('../config/db');
const logger = require('../utils/logger');

// Create a new promo code
exports.createPromoCode = (promoData, callback) => {
    const sql = `
        INSERT INTO promo_code (code, discountType, discountValue, appliesTo, startDate, expiryDate)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
        promoData.code,
        promoData.discountType,
        promoData.discountValue,
        promoData.appliesTo,
        promoData.startDate,
        promoData.expiryDate,
    ];

    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { id: results.insertId, ...promoData });
        });
    });
};

// Get a promo code by ID
exports.getPromoCodeById = (promoId, callback) => {
    const sql = `SELECT * FROM promo_code WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [promoId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results[0]);
        });
    });
};

// Get all promo codes
exports.getAllPromoCodes = (callback) => {
    const sql = `SELECT * FROM promo_code`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};

// Update a promo code
exports.updatePromoCode = (promoId, promoData, callback) => {
    const sql = `
        UPDATE promo_code SET code = ?, discountType = ?, discountValue = ?, appliesTo = ?, startDate = ?, expiryDate = ?
        WHERE id = ?;
    `;
    const values = [
        promoData.code,
        promoData.discountType,
        promoData.discountValue,
        promoData.appliesTo,
        promoData.startDate,
        promoData.expiryDate,
        promoId,
    ];

    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { ...promoData, id: promoId });
        });
    });
};

// Delete a promo code
exports.deletePromoCode = (promoId, callback) => {
    const sql = `DELETE FROM promo_code WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [promoId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};
