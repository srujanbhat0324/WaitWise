const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Queue = require('../models/Queue');
const { auth, requireDeptAdmin, requireSuperAdmin } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   PUT api/department/:id
// @desc    Edit a department
// @access  Private (Super Admin)
router.put('/:id', requireSuperAdmin, async (req, res) => {
    const { name, avgWaitTimePerToken } = req.body;

    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ msg: 'Department not found' });
        }

        if (name) department.name = name;
        if (avgWaitTimePerToken !== undefined) department.avgWaitTimePerToken = avgWaitTimePerToken;

        await department.save();

        // Log activity
        await ActivityLog.create({
            userId: req.user.id,
            action: 'department_edit',
            departmentId: department._id,
            details: `Updated department: ${department.name}`
        });

        res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/department/:id
// @desc    Delete a department
// @access  Private (Super Admin)
router.delete('/:id', requireSuperAdmin, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ msg: 'Department not found' });
        }

        // Delete all queues in this department
        await Queue.deleteMany({ departmentId: req.params.id });

        await Department.findByIdAndDelete(req.params.id);

        // Log activity
        await ActivityLog.create({
            userId: req.user.id,
            action: 'department_delete',
            departmentId: req.params.id,
            details: `Deleted department: ${department.name}`
        });

        res.json({ msg: 'Department deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/department/:id/avg-time
// @desc    Update average time per token
// @access  Private (Dept Admin or Super Admin)
router.put('/:id/avg-time', requireDeptAdmin, async (req, res) => {
    const { avgWaitTimePerToken } = req.body;

    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ msg: 'Department not found' });
        }

        department.avgWaitTimePerToken = avgWaitTimePerToken;
        await department.save();

        // Log activity
        await ActivityLog.create({
            userId: req.user.id,
            action: 'department_edit',
            departmentId: department._id,
            details: `Updated avg time to ${avgWaitTimePerToken} minutes`
        });

        res.json(department);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/department/:id/analytics
// @desc    Get department analytics
// @access  Private (Dept Admin or Super Admin)
router.get('/:id/analytics', requireDeptAdmin, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ msg: 'Department not found' });
        }

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedToday = await Queue.countDocuments({
            departmentId: req.params.id,
            status: 'Completed',
            completedAt: { $gte: today }
        });

        const servingToday = await Queue.countDocuments({
            departmentId: req.params.id,
            status: 'Serving',
            servedAt: { $gte: today }
        });

        const totalServed = completedToday + servingToday;

        // Calculate average processing time
        const completedQueues = await Queue.find({
            departmentId: req.params.id,
            status: 'Completed',
            completedAt: { $gte: today }
        });

        let avgProcessingTime = 0;
        if (completedQueues.length > 0) {
            const totalTime = completedQueues.reduce((sum, queue) => {
                if (queue.servedAt && queue.completedAt) {
                    return sum + (queue.completedAt - queue.servedAt);
                }
                return sum;
            }, 0);
            avgProcessingTime = Math.round(totalTime / completedQueues.length / 60000); // Convert to minutes
        }

        res.json({
            tokensServedToday: totalServed,
            tokensCompletedToday: completedToday,
            avgProcessingTime,
            currentToken: department.currentToken,
            totalTokens: department.totalTokens,
            isPaused: department.isPaused,
            crowdLevel: department.crowdLevel
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
