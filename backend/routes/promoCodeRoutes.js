const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');
const verifyToken = require('../middlewares/verifyToken');

router.post(
    '/promo-codes/create',
    verifyToken,
    promoCodeController.createPromoCode
);
router.get(
    '/promo-codes/:id',
    verifyToken,
    promoCodeController.getPromoCodeById
);
router.get('/promo-codes', verifyToken, promoCodeController.getAllPromoCodes);
router.put(
    '/promo-codes/:id',
    verifyToken,
    promoCodeController.updatePromoCode
);
router.delete(
    '/promo-codes/:id',
    verifyToken,
    promoCodeController.deletePromoCode
);

module.exports = router;
