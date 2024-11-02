const planModel = require('../models/planModel');
const logger = require('../utils/logger');

// Create a new plan
exports.createPlan = (req, res) => {
    if (req.userRole !== 1)
        return res.status(403).json({ error: 'Access denied' });

    const planData = req.body;
    planModel.createPlan(planData, (err, newPlan) => {
        if (err) {
            logger.error(`Error creating plan: ${err.message}`);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({
            message: 'Plan created successfully',
            plan: newPlan,
        });
    });
};

// Get plan by ID
exports.getPlanById = (req, res) => {
    const planId = req.params.id;
    planModel.getPlanById(planId, (err, plan) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!plan) return res.status(404).json({ error: 'Plan not found' });
        res.json({ plan });
    });
};

// Get all plans
exports.getAllPlans = (req, res) => {
    planModel.getAllPlans((err, plans) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ plans });
    });
};

exports.updatePlan = (req, res) => {
    if (req.userRole !== 1)
        return res.status(403).json({ error: 'Access denied' });

    const planId = req.params.id;
    const newPlanData = req.body;

    // First, fetch the existing plan to retain any unchanged fields
    planModel.getPlanById(planId, (err, existingPlan) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!existingPlan)
            return res.status(404).json({ error: 'Plan not found' });

        // Merge existing plan data with the new data
        const planData = { ...existingPlan, ...newPlanData };

        // Update the plan with the merged data
        planModel.updatePlan(planId, planData, (err, updatedPlan) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({
                message: 'Plan updated successfully',
                plan: updatedPlan,
            });
        });
    });
};

// Delete a plan
exports.deletePlan = (req, res) => {
    const planId = req.params.id;
    planModel.deletePlan(planId, (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Failed to delete plan' });
        res.json({ message: 'Plan deleted successfully' });
    });
};
