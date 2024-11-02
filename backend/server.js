// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectToDatabase } = require('./config/db');
const logger = require('./utils/logger');
const registerRoutes = require('./utils/registerRoutes');
const errorHandler = require('./middlewares/errorHandler');
const http = require('http');
const { initSocket } = require('./config/socket'); // Import the socket initialization

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Use CORS middleware
app.use(cors(corsOptions));

// Error handling middleware
app.use(errorHandler);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes under the /api/v1 prefix
registerRoutes(app, '/api/v1/');

// Initialize Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Connect to the database and start the server only if successful
connectToDatabase((err) => {
    if (err) {
        logger.error('Failed to connect to the database. Server not started.');
    } else {
        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    }
});
