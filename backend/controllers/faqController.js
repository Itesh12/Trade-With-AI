const faqModel = require('../models/faqModel');
const logger = require('../utils/logger');

// Create a new FAQ
exports.createFaq = (req, res) => {
    if (req.userRole !== 1)
        return res.status(403).json({ error: 'Access denied' });

    const faqData = req.body;
    faqModel.createFaq(faqData, (err, newFaq) => {
        if (err) {
            logger.error(`Error creating FAQ: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'FAQ created successfully',
            faq: newFaq,
        });
    });
};

// Get FAQ by ID
exports.getFaqById = (req, res) => {
    const faqId = req.params.id;
    faqModel.getFaqById(faqId, (err, faq) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!faq) return res.status(404).json({ error: 'FAQ not found' });
        res.json({ faq });
    });
};

// Get all FAQs
exports.getAllFaqs = (req, res) => {
    faqModel.getAllFaqs((err, faqs) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ faqs });
    });
};

// Update an FAQ
exports.updateFaq = (req, res) => {
    if (req.userRole !== 1)
        return res.status(403).json({ error: 'Access denied' });

    const faqId = req.params.id;
    const newFaqData = req.body;

    faqModel.getFaqById(faqId, (err, existingFaq) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!existingFaq)
            return res.status(404).json({ error: 'FAQ not found' });

        const faqData = { ...existingFaq, ...newFaqData };
        faqModel.updateFaq(faqId, faqData, (err, updatedFaq) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({
                message: 'FAQ updated successfully',
                faq: updatedFaq,
            });
        });
    });
};

// Delete an FAQ
exports.deleteFaq = (req, res) => {
    const faqId = req.params.id;
    faqModel.deleteFaq(faqId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to delete FAQ' });
        res.json({ message: 'FAQ deleted successfully' });
    });
};
