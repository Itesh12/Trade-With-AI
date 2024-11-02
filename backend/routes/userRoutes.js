const express = require('express');
const db = require('../config/db');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser, // Import the deleteUser function
} = require('../controllers/userController');

// Get all users (admin access)
router.get('/users/', verifyToken, getAllUsers);

// Get a user by ID
router.get('/users/:id', verifyToken, getUserById);

// Update user profile (user access)
router.put('/users/:id', verifyToken, updateUser);

// Delete user by ID
router.delete('/users/:id', verifyToken, deleteUser); // Add the delete route

module.exports = router;
