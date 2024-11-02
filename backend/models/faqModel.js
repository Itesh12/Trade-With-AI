const { connectToDatabase } = require('../config/db');
const logger = require('../utils/logger');

// Create a new FAQ
exports.createFaq = (faqData, callback) => {
    const sql = `
        INSERT INTO faq (question, answer, status)
        VALUES (?, ?, ?);
    `;
    const values = [faqData.question, faqData.answer, faqData.status];

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { id: results.insertId, ...faqData });
        });
    });
};

// Get an FAQ by ID
exports.getFaqById = (faqId, callback) => {
    const sql = `SELECT * FROM faq WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [faqId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results[0]);
        });
    });
};

// Get all FAQs
exports.getAllFaqs = (callback) => {
    const sql = `SELECT * FROM faq`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};

// Update an FAQ
exports.updateFaq = (faqId, faqData, callback) => {
    const sql = `
        UPDATE faq SET question = ?, answer = ?, status = ?
        WHERE id = ?;
    `;
    const values = [faqData.question, faqData.answer, faqData.status, faqId];

    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { ...faqData, id: faqId });
        });
    });
};

// Delete an FAQ
exports.deleteFaq = (faqId, callback) => {
    const sql = `DELETE FROM faq WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [faqId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};
