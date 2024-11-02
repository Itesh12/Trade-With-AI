// config/socket.js

const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Listen for events (e.g., trade updates)
        socket.on('tradeUpdated', (data) => {
            console.log('Trade updated:', data);
            // Emit updates to all connected clients
            io.emit('tradeUpdated', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

const getSocket = () => {
    if (!io) {
        throw new Error('Socket not initialized!');
    }
    return io;
};

module.exports = {
    initSocket,
    getSocket,
};
