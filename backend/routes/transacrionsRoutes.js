const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const verifyToken = require('../middlewares/verifyToken');

router.post(
    '/transactions/create',
    verifyToken,
    transactionController.createTransaction
);
router.get(
    '/transactions/:id',
    verifyToken,
    transactionController.getTransactionById
);
router.get(
    '/transactions',
    verifyToken,
    transactionController.getAllTransactions
);
router.put(
    '/transactions/:id',
    verifyToken,
    transactionController.updateTransaction
);
router.delete(
    '/transactions/:id',
    verifyToken,
    transactionController.deleteTransaction
);

module.exports = router;
