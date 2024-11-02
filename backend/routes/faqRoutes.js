const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/faq/create', verifyToken, faqController.createFaq);
router.get('/faq/:id', verifyToken, faqController.getFaqById);
router.get('/faq', verifyToken, faqController.getAllFaqs);
router.put('/faq/:id', verifyToken, faqController.updateFaq);
router.delete('/faq/:id', verifyToken, faqController.deleteFaq);

module.exports = router;
