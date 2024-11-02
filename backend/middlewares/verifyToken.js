const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from the Authorization header

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Save user ID and role to the request for use in other routes
        req.userId = decoded.id; // User ID from token
        req.userRole = decoded.role; // User role from token
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = verifyToken;
