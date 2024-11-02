const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const verifyToken = require('../middlewares/verifyToken');

// Create a new trade
router.post('/trades/create', verifyToken, tradeController.createTrade);

// Get all trades
router.get('/trades/', verifyToken, tradeController.getAllTrades);

// Get a specific trade by ID
router.get('/trades/:id', verifyToken, tradeController.getTradeById);

// Update a trade by ID
router.put('/trades/:id', verifyToken, tradeController.updateTrade);

// Delete a trade by ID
router.delete('/trades/:id', verifyToken, tradeController.deleteTrade);

// Get trades by date
router.get('/trades/date/:date', verifyToken, tradeController.getTradesByDate);

// Add a new trade history entry
router.post(
    '/trades/history/:tradeId',
    verifyToken,
    tradeController.addTradeHistory
);

// Get trade history by trade ID
router.get(
    '/trades/history/:tradeId',
    verifyToken,
    tradeController.getTradeHistoryByTradeId
);

module.exports = router;
