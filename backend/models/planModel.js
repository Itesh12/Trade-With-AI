const { connectToDatabase } = require('../config/db');
const logger = require('../utils/logger');

// Create a new plan
exports.createPlan = (planData, callback) => {
    const sql = `
        INSERT INTO plans (planName, planDuration, planPrice, planDiscountPrice, discountPercentage)
        VALUES (?, ?, ?, ?, ?);
    `;
    const values = [
        planData.planName,
        planData.planDuration,
        planData.planPrice,
        planData.planDiscountPrice,
        planData.discountPercentage,
    ];

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { id: results.insertId, ...planData });
        });
    });
};

// Get a plan by ID
exports.getPlanById = (planId, callback) => {
    const sql = `SELECT * FROM plans WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [planId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results[0]);
        });
    });
};

// Get all plans
exports.getAllPlans = (callback) => {
    const sql = `SELECT * FROM plans`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};

exports.getPlanById = (planId, callback) => {
    const sql = `SELECT * FROM plans WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [planId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results[0]);
        });
    });
};

exports.updatePlan = (planId, planData, callback) => {
    const sql = `
        UPDATE plans SET 
            planName = ?, 
            planDuration = ?, 
            planPrice = ?, 
            planDiscountPrice = ?, 
            discountPercentage = ?
        WHERE id = ?;
    `;
    const values = [
        planData.planName,
        planData.planDuration,
        planData.planPrice,
        planData.planDiscountPrice,
        planData.discountPercentage,
        planId,
    ];

    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, { ...planData, id: planId });
        });
    });
};

// Delete a plan
exports.deletePlan = (planId, callback) => {
    const sql = `DELETE FROM plans WHERE id = ?`;
    connectToDatabase((err, connection) => {
        if (err) return callback(err);
        connection.query(sql, [planId], (err, results) => {
            connection.release();
            if (err) return callback(err);
            callback(null, results);
        });
    });
};
