// middleware/errorHandler.js
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    logger.error(err.stack); // Log the error stack
    res.status(500).json({ message: 'An error occurred', error: err.message });
};
