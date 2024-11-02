const transactionModel = require('../models/transactionModel');
const logger = require('../utils/logger');

// Create a new transaction
exports.createTransaction = (req, res) => {
    const transactionData = req.body;
    transactionModel.createTransaction(
        transactionData,
        (err, newTransaction) => {
            if (err) {
                logger.error(`Error creating transaction: ${err.message}`);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({
                message: 'Transaction created successfully',
                transaction: newTransaction,
            });
        }
    );
};

// Get transaction by ID
exports.getTransactionById = (req, res) => {
    const transactionId = req.params.id;
    transactionModel.getTransactionById(transactionId, (err, transaction) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!transaction)
            return res.status(404).json({ error: 'Transaction not found' });
        res.json({ transaction });
    });
};

// Get all transactions
exports.getAllTransactions = (req, res) => {
    transactionModel.getAllTransactions((err, transactions) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ transactions });
    });
};

// Update a transaction
exports.updateTransaction = (req, res) => {
    const transactionId = req.params.id;
    const newTransactionData = req.body;

    transactionModel.getTransactionById(
        transactionId,
        (err, existingTransaction) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!existingTransaction)
                return res.status(404).json({ error: 'Transaction not found' });

            const transactionData = {
                ...existingTransaction,
                ...newTransactionData,
            };

            transactionModel.updateTransaction(
                transactionId,
                transactionData,
                (err, updatedTransaction) => {
                    if (err)
                        return res
                            .status(500)
                            .json({ error: 'Database error' });
                    res.json({
                        message: 'Transaction updated successfully',
                        transaction: updatedTransaction,
                    });
                }
            );
        }
    );
};

// Delete a transaction
exports.deleteTransaction = (req, res) => {
    const transactionId = req.params.id;
    transactionModel.deleteTransaction(transactionId, (err) => {
        if (err)
            return res
                .status(500)
                .json({ error: 'Failed to delete transaction' });
        res.json({ message: 'Transaction deleted successfully' });
    });
};
