const express = require('express');
const router = express.Router();
const feedbackReportController = require('../controllers/feedbackReportController');
const verifyToken = require('../middlewares/verifyToken');

// Routes for feedbacks and reports
router.post(
    '/feedback-report/create',
    verifyToken,
    feedbackReportController.createFeedbackOrReport
);
router.get(
    '/feedback-report/:id',
    verifyToken,
    feedbackReportController.getFeedbackOrReportById
);
router.get(
    '/feedback-report',
    verifyToken,
    feedbackReportController.getAllFeedbacksAndReports
);
router.put(
    '/feedback-report/:id',
    verifyToken,
    feedbackReportController.updateFeedbackOrReport
);
router.delete(
    '/feedback-report/:id',
    verifyToken,
    feedbackReportController.deleteFeedbackOrReport
);

module.exports = router;
