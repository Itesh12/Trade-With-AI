const promoCodeModel = require('../models/promoCodeModel');
const logger = require('../utils/logger');

// Create a new promo code
exports.createPromoCode = (req, res) => {
    if (req.userRole !== 1)
        return res.status(403).json({ error: 'Access denied' });

    const promoData = req.body;
    promoCodeModel.createPromoCode(promoData, (err, newPromo) => {
        if (err) {
            logger.error(`Error creating promo code: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Promo code created successfully',
            promoCode: newPromo,
        });
    });
};

// Get promo code by ID
exports.getPromoCodeById = (req, res) => {
    const promoId = req.params.id;
    promoCodeModel.getPromoCodeById(promoId, (err, promoCode) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!promoCode)
            return res.status(404).json({ error: 'Promo code not found' });
        res.json({ promoCode });
    });
};

// Get all promo codes
exports.getAllPromoCodes = (req, res) => {
    promoCodeModel.getAllPromoCodes((err, promoCodes) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ promoCodes });
    });
};

// Update a promo code
exports.updatePromoCode = (req, res) => {
    if (req.userRole !== 1)
        return res.status(403).json({ error: 'Access denied' });

    const promoId = req.params.id;
    const promoData = req.body;
    promoCodeModel.updatePromoCode(promoId, promoData, (err, updatedPromo) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({
            message: 'Promo code updated successfully',
            promoCode: updatedPromo,
        });
    });
};

// Delete a promo code
exports.deletePromoCode = (req, res) => {
    const promoId = req.params.id;
    promoCodeModel.deletePromoCode(promoId, (err, result) => {
        if (err)
            return res
                .status(500)
                .json({ error: 'Failed to delete promo code' });
        res.json({ message: 'Promo code deleted successfully' });
    });
};
