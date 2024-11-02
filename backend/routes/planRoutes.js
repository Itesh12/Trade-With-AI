const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/plans/create', verifyToken, planController.createPlan);
router.get('/plans/:id', verifyToken, planController.getPlanById);
router.get('/plans', verifyToken, planController.getAllPlans);
router.put('/plans/:id', verifyToken, planController.updatePlan);
router.delete('/plans/:id', verifyToken, planController.deletePlan);

module.exports = router;
