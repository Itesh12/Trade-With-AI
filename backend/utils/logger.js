// utils/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: 'error.log', level: 'error' }), // Log error messages to a file
        new transports.File({ filename: 'combined.log' }), // Log all messages to a file
    ],
});

module.exports = logger;
