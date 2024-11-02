const tradeModel = require('../models/tradeModel'); // Import your custom Trade model
const logger = require('../utils/logger');
const { getSocket } = require('../config/socket'); // Import getSocket

// Create a new trade
exports.createTrade = (req, res) => {
    if (req.userRole !== 1) {
        return res
            .status(403)
            .json({ error: 'Access denied', user: req.userId });
    }
    const tradeData = req.body;

    tradeModel.createTrade(tradeData, (err, newTrade) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Trade created successfully',
            trade: newTrade,
        });
    });
};

// Get all trades with trade history
exports.getAllTrades = (req, res) => {
    tradeModel.getAllTrades((err, trades) => {
        if (err) {
            logger.error(`Error fetching trades: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }

        const tradePromises = trades.map((trade) => {
            return new Promise((resolve) => {
                tradeModel.getTradeHistoryByTradeId(
                    trade.id,
                    (err, history) => {
                        if (err) {
                            logger.error(
                                `Error fetching trade history: ${err.message}`
                            );
                            return resolve(trade); // Return trade without history on error
                        }
                        trade.tradeHistory = history; // Attach history to trade
                        resolve(trade);
                    }
                );
            });
        });

        Promise.all(tradePromises).then((tradeWithHistory) => {
            res.json({ trades: tradeWithHistory });
        });
    });
};

// Get a single trade by ID
exports.getTradeById = (req, res) => {
    if (req.userRole !== 1) {
        return res
            .status(403)
            .json({ error: 'Access denied', user: req.userId });
    }

    const { id } = req.params;

    tradeModel.getTradeById(id, (err, trade) => {
        if (err) {
            logger.error(`Error fetching trade by ID: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        res.json({ trade });
    });
};

// exports.updateTrade = (req, res) => {
//     if (req.userRole !== 1) {
//         return res
//             .status(403)
//             .json({ error: 'Access denied', user: req.userId });
//     }

//     const { id } = req.params;
//     const updates = req.body;

//     tradeModel.updateTrade(id, updates, (err, updatedTrade) => {
//         if (err) {
//             logger.error(`Error updating trade: ${err.message}`);
//             return res.status(500).json({ error: 'Database error' });
//         }
//         if (!updatedTrade) {
//             return res
//                 .status(404)
//                 .json({ error: 'Trade not found or update failed' });
//         }

//         // Emit the updated trade to all connected clients using the Socket.IO instance
//         const io = getSocket();
//         io.emit('tradeUpdated', updatedTrade);

//         res.json({
//             message: 'Trade updated successfully',
//             trade: updatedTrade,
//         });
//     });
// };

// Delete a trade by ID

// Update a trade by ID
exports.updateTrade = (req, res) => {
    if (req.userRole !== 1) {
        return res
            .status(403)
            .json({ error: 'Access denied', user: req.userId });
    }

    const { id } = req.params;
    const updates = req.body;

    tradeModel.getTradeById(id, (err, existingTrade) => {
        if (err || !existingTrade) {
            logger.error(`Error fetching trade for update: ${err.message}`);
            return res.status(500).json({ error: 'Trade not found' });
        }

        tradeModel.updateTrade(id, updates, (err, updatedTrade) => {
            if (err) {
                logger.error(`Error updating trade: ${err.message}`);
                return res.status(500).json({ error: 'Database error' });
            }

            // Check for target status updates and add trade history
            const actions = [];
            if (
                updates.targetOneStatus === 1 &&
                existingTrade.targetOneStatus !== 1
            ) {
                actions.push(
                    `${existingTrade.tradeName} 1st Target Hit @ ${existingTrade.targetOne}+`
                );
            }
            if (
                updates.targetTwoStatus === 1 &&
                existingTrade.targetTwoStatus !== 1
            ) {
                actions.push(
                    `${existingTrade.tradeName} 2nd Target Hit @ ${existingTrade.targetTwo}+`
                );
            }
            if (
                updates.targetThreeStatus === 1 &&
                existingTrade.targetThreeStatus !== 1
            ) {
                actions.push(
                    `${existingTrade.tradeName} 3rd Target Hit @ ${existingTrade.targetThree}+`
                );
            }
            if (
                updates.targetFourStatus === 1 &&
                existingTrade.targetFourStatus !== 1
            ) {
                actions.push(
                    `${existingTrade.tradeName} 4th Target Hit @ ${existingTrade.targetFour}+`
                );
            }
            if (
                updates.stopLossStatus === 1 &&
                existingTrade.stopLossStatus !== 1
            ) {
                actions.push(
                    `${existingTrade.tradeName} Stoploss Hit @ ${existingTrade.stopLoss}+`
                );
            }

            // Call addTradeHistory for each action
            const historyPromises = actions.map((action) => {
                return new Promise((resolve, reject) => {
                    tradeModel.addTradeHistory(
                        id,
                        action,
                        (err, newHistory) => {
                            if (err) {
                                logger.error(
                                    `Error adding trade history: ${err.message}`
                                );
                                return reject(err);
                            }
                            resolve(newHistory);
                        }
                    );
                });
            });

            Promise.all(historyPromises)
                .then(() => {
                    // Emit the updated trade to all connected clients using the Socket.IO instance
                    const io = getSocket();
                    io.emit('tradeUpdated', updatedTrade);

                    res.json({
                        message: 'Trade updated successfully',
                        trade: updatedTrade,
                    });
                })
                .catch((err) => {
                    logger.error(
                        `Error in adding trade history: ${err.message}`
                    );
                    return res
                        .status(500)
                        .json({ error: 'Error in adding trade history' });
                });
        });
    });
};

exports.deleteTrade = (req, res) => {
    if (req.userRole !== 1) {
        return res
            .status(403)
            .json({ error: 'Access denied', user: req.userId });
    }

    const { id } = req.params;

    tradeModel.deleteTrade(id, (err, result) => {
        if (err) {
            logger.error(`Error deleting trade: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!result) {
            return res
                .status(404)
                .json({ error: 'Trade not found or deletion failed' });
        }
        res.json({ message: 'Trade deleted successfully' });
    });
};

// Get trades by date
exports.getTradesByDate = (req, res) => {
    const { date } = req.params;
    console.log(`Received date: ${date}`); // Log the date received

    tradeModel.getTradesByDate(date, (err, trades) => {
        if (err) {
            logger.error(`Error fetching trades by date: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }

        console.log(`Trades fetched:`, trades); // Log the fetched trades
        res.json({ trades });
    });
};

// Add a new trade history entry
exports.addTradeHistory = (req, res) => {
    const { tradeId } = req.params;
    const { action } = req.body; // Assuming action is sent in the request body

    tradeModel.addTradeHistory(tradeId, action, (err, newHistory) => {
        if (err) {
            logger.error(`Error adding trade history: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Trade history added successfully',
            history: newHistory,
        });
    });
};

// Get trade history by trade ID
exports.getTradeHistoryByTradeId = (req, res) => {
    const { tradeId } = req.params;

    tradeModel.getTradeHistoryByTradeId(tradeId, (err, history) => {
        if (err) {
            logger.error(`Error fetching trade history: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ history });
    });
};
