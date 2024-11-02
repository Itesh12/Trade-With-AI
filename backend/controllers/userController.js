// controllers/userController.js
const userModel = require('../models/userModel');
const logger = require('../utils/logger');

exports.getAllUsers = async (req, res) => {
    if (req.userRole !== 1) {
        return res
            .status(403)
            .json({ error: 'Access denied', user: req.userId });
    }

    try {
        const users = await userModel.getAllUsers();
        res.json({ users });
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.getUserById = async (req, res) => {
    if (req.userRole !== 1) {
        return res
            .status(403)
            .json({ error: 'Access denied', user: req.userId });
    }

    try {
        const user = await userModel.getUserById(req.params.id);
        res.json({ user });
    } catch (error) {
        logger.warn(`User not found: ID ${req.params.id}`);
        res.status(404).json({ error: 'User not found' });
    }
};

exports.updateUser = async (req, res) => {
    const updates = { ...req.body };
    delete updates.token;

    try {
        await userModel.updateUser(req.params.id, updates);
        const updatedUser = await userModel.getUserById(req.params.id);
        const { password, ...userWithoutPassword } = updatedUser;
        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword,
        });
    } catch (error) {
        logger.error(
            `Update error for user ID ${req.params.id}: ${error.message}`
        );
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.deleteUser = async (req, res) => {
    if (req.userRole !== 1) {
        return res
            .status(403)
            .json({ error: 'Access denied', user: req.userId });
    }

    try {
        await userModel.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully', user: req.userId });
    } catch (error) {
        logger.warn(`Delete failed, user not found: ID ${req.params.id}`);
        res.status(404).json({ error: 'User not found' });
    }
};
