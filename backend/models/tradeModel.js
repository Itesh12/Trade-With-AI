const { connectToDatabase } = require('../config/db');
const logger = require('../utils/logger');

// Create a new trade
exports.createTrade = (tradeData, callback) => {
    const sqlInsert = `
        INSERT INTO trades 
        (tradeSignal, tradeName, entryPrice, stopLoss, targetOne, targetTwo, targetThree, targetFour, pnlPrice, pnlPercentage, lot, quantity, price, status, type, tradeDuration, tradeTypeName, targetOneStatus, targetTwoStatus, targetThreeStatus, targetFourStatus, stopLossStatus, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
    `;

    const values = [
        tradeData.tradeSignal ?? 1,
        tradeData.tradeName,
        tradeData.entryPrice,
        tradeData.stopLoss,
        tradeData.targetOne,
        tradeData.targetTwo,
        tradeData.targetThree,
        tradeData.targetFour,
        tradeData.pnlPrice,
        tradeData.pnlPercentage,
        tradeData.lot,
        tradeData.quantity,
        tradeData.price,
        tradeData.status,
        tradeData.type,
        tradeData.tradeDuration,
        tradeData.tradeTypeName,
        tradeData.targetOneStatus ?? 0,
        tradeData.targetTwoStatus ?? 0,
        tradeData.targetThreeStatus ?? 0,
        tradeData.targetFourStatus ?? 0,
        tradeData.stopLossStatus ?? 0,
    ];

    // Connect to the database
    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        // Execute the insert SQL query
        connection.query(sqlInsert, values, (err, results) => {
            if (err) {
                connection.release(); // Ensure the connection is released on error
                logger.error(`Error creating trade: ${err.message}`);
                return callback(err);
            }

            // Retrieve the last inserted ID
            const tradeId = results.insertId;

            // Now, fetch the trade including createdAt and updatedAt
            const sqlSelect = 'SELECT * FROM trades WHERE id = ?';
            connection.query(sqlSelect, [tradeId], (err, tradeResults) => {
                connection.release(); // Release the connection
                if (err) {
                    logger.error(
                        `Error fetching created trade: ${err.message}`
                    );
                    return callback(err);
                }

                if (tradeResults.length === 0) {
                    return callback(
                        new Error('Trade not found after creation.')
                    );
                }

                const createdTrade = tradeResults[0];

                // Construct the response with the required fields
                const responseTrade = {
                    id: createdTrade.id,
                    createdAt: createdTrade.createdAt,
                    updatedAt: createdTrade.updatedAt,
                    ...tradeData,
                };

                callback(null, responseTrade);
            });
        });
    });
};

// Fetch all trades
exports.getAllTrades = (callback) => {
    const sql = 'SELECT * FROM trades';

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        connection.query(sql, (err, results) => {
            connection.release();
            if (err) {
                logger.error(`Error fetching trades: ${err.message}`);
                return callback(err);
            }
            callback(null, results);
        });
    });
};

// Fetch a single trade by ID
exports.getTradeById = (id, callback) => {
    const sql = 'SELECT * FROM trades WHERE id = ?';

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        connection.query(sql, [id], (err, results) => {
            connection.release();
            if (err) {
                logger.error(`Error fetching trade by ID: ${err.message}`);
                return callback(err);
            }
            callback(null, results[0]);
        });
    });
};

// Update a trade by ID
exports.updateTrade = (id, updates, callback) => {
    const setClause = Object.keys(updates)
        .map((field) => `${field} = ?`)
        .join(', ');
    const values = [...Object.values(updates), id];

    // Update query
    const sqlUpdate = `UPDATE trades SET ${setClause}, updatedAt = NOW() WHERE id = ?`;

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        // Execute the update SQL query
        connection.query(sqlUpdate, values, (err, results) => {
            if (err || results.affectedRows === 0) {
                connection.release(); // Ensure the connection is released on error
                logger.warn(`Trade not found or update failed for ID ${id}`);
                return callback(err || new Error('Trade not found'));
            }

            // After a successful update, fetch the complete updated trade
            const sqlSelect = 'SELECT * FROM trades WHERE id = ?';
            connection.query(sqlSelect, [id], (err, tradeResults) => {
                connection.release(); // Release the connection
                if (err) {
                    logger.error(
                        `Error fetching updated trade: ${err.message}`
                    );
                    return callback(err);
                }

                if (tradeResults.length === 0) {
                    return callback(new Error('Trade not found after update.'));
                }

                // Retrieve the complete trade data
                const updatedTrade = tradeResults[0];

                // Construct the response with the complete updated trade details
                callback(null, updatedTrade);
            });
        });
    });
};

// Delete a trade by ID
exports.deleteTrade = (id, callback) => {
    const sql = 'DELETE FROM trades WHERE id = ?';

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        connection.query(sql, [id], (err, results) => {
            connection.release();
            if (err || results.affectedRows === 0) {
                logger.warn(`Trade not found or deletion failed for ID ${id}`);
                return callback(err || new Error('Trade not found'));
            }
            callback(null, true);
        });
    });
};

// Fetch trades by date
exports.getTradesByDate = (date, callback) => {
    const sql = 'SELECT * FROM trades WHERE DATE(createdAt) = ?';

    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        connection.query(sql, [date], (err, results) => {
            connection.release();
            if (err) {
                logger.error(`Error fetching trades by date: ${err.message}`);
                return callback(err);
            }
            callback(null, results);
        });
    });
};

// Add a new trade history entry
exports.addTradeHistory = (tradeId, action, callback) => {
    const query = 'INSERT INTO tradeHistory (tradeId, action) VALUES (?, ?)';
    // Use the db connection to execute the query
    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        connection.query(query, [tradeId, action], (err, result) => {
            connection.release(); // Always release the connection
            if (err) return callback(err);
            callback(null, {
                id: result.insertId,
                tradeId,
                action,
                createdAt: new Date(),
            });
        });
    });
};

// Get trade history by trade ID
exports.getTradeHistoryByTradeId = (tradeId, callback) => {
    const query = 'SELECT * FROM tradeHistory WHERE tradeId = ?';
    connectToDatabase((err, connection) => {
        if (err) {
            logger.error(`Database connection error: ${err.message}`);
            return callback(err);
        }

        connection.query(query, [tradeId], (err, results) => {
            connection.release(); // Release the connection
            if (err) return callback(err);
            callback(null, results);
        });
    });
};
