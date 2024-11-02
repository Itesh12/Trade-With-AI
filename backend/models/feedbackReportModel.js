const { connectToDatabase } = require('../config/db');
const logger = require('../utils/logger');

// Create a new feedback or report
exports.createFeedbackOrReport = (data, callback) => {
    const sql = `
        INSERT INTO feedbacks_reports (userId, text, type, image, status, severity)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
        data.userId,
        data.text,
        data.type,
        data.image || null,
        data.status || 0,
        data.severity || 0,
    ];

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { id: results.insertId, ...data });
        });
    });
};

// Get feedback or report by ID
exports.getFeedbackOrReportById = (id, callback) => {
    const sql = `SELECT * FROM feedbacks_reports WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [id], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results[0]);
        });
    });
};

// Get all feedbacks and reports
exports.getAllFeedbacksAndReports = (callback) => {
    const sql = `SELECT * FROM feedbacks_reports`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};

// Update feedback or report
exports.updateFeedbackOrReport = (id, data, callback) => {
    const sql = `
        UPDATE feedbacks_reports SET
            text = ?, type = ?, image = ?, status = ?, severity = ?
        WHERE id = ?;
    `;
    const values = [
        data.text,
        data.type,
        data.image || null,
        data.status,
        data.severity,
        id,
    ];

    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { ...data, id });
        });
    });
};

// Delete feedback or report
exports.deleteFeedbackOrReport = (id, callback) => {
    const sql = `DELETE FROM feedbacks_reports WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [id], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};
