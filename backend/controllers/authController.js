// controllers/authController.js
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const defaultValues = {
        profilePicture: null,
        dateOfBirth: null,
        address: null,
        mobilenumber: null,
        gender: null,
        role: 0,
        premiumUser: 0,
        status: 1,
        premiumPurchaseDate: null,
        lastLogin: null,
        notificationStatus: 1,
    };

    try {
        const newUser = await userModel.registerUser({
            firstName,
            lastName,
            email,
            password,
            ...defaultValues,
        });
        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.loginUser(email);
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            logger.warn(`Invalid password attempt for email: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        await userModel.updateUserToken(user.id, token);
        await userModel.updateLastLogin(user.id); // Update lastLogin here

        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: 'Login successful',
            user: { ...userWithoutPassword, token },
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ error: 'An error occurred' });
    }
};
