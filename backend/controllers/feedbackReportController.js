const feedbackReportModel = require('../models/feedbackReportModel');
const logger = require('../utils/logger');

// Create a feedback or report
exports.createFeedbackOrReport = (req, res) => {
    const data = {
        userId: req.userId, // assuming userId is obtained from token
        text: req.body.text,
        type: req.body.type,
        image: req.body.image,
        status: req.body.status,
        severity: req.body.severity,
    };

    feedbackReportModel.createFeedbackOrReport(data, (err, feedbackReport) => {
        if (err) {
            logger.error(`Error creating feedback or report: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Entry created successfully',
            feedbackReport,
        });
    });
};

// Get feedback or report by ID
exports.getFeedbackOrReportById = (req, res) => {
    const id = req.params.id;
    feedbackReportModel.getFeedbackOrReportById(id, (err, feedbackReport) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!feedbackReport)
            return res.status(404).json({ error: 'Entry not found' });
        res.json({ feedbackReport });
    });
};

// Get all feedbacks and reports
exports.getAllFeedbacksAndReports = (req, res) => {
    feedbackReportModel.getAllFeedbacksAndReports((err, feedbackReports) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ feedbackReports });
    });
};

// Update feedback or report
exports.updateFeedbackOrReport = (req, res) => {
    const id = req.params.id;
    const data = {
        text: req.body.text,
        type: req.body.type,
        image: req.body.image,
        status: req.body.status,
        severity: req.body.severity,
    };

    feedbackReportModel.updateFeedbackOrReport(
        id,
        data,
        (err, updatedEntry) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({
                message: 'Entry updated successfully',
                feedbackReport: updatedEntry,
            });
        }
    );
};

// Delete feedback or report
exports.deleteFeedbackOrReport = (req, res) => {
    const id = req.params.id;
    feedbackReportModel.deleteFeedbackOrReport(id, (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Failed to delete entry' });
        res.json({ message: 'Entry deleted successfully' });
    });
};
