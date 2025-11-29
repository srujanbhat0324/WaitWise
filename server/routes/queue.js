const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Queue = require('../models/Queue');
const auth = require('../middleware/auth');

// @route   GET api/queue/:deptId
// @desc    Get current status of a department
// @access  Public
router.get('/:deptId', async (req, res) => {
    try {
        const dept = await Department.findById(req.params.deptId);
        if (!dept) return res.status(404).json({ msg: 'Department not found' });
        res.json(dept);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/queue/:deptId/join
// @desc    Join the queue (Get a token)
// @access  Private (User)
router.post('/:deptId/join', auth, async (req, res) => {
    try {
        const dept = await Department.findById(req.params.deptId);
        if (!dept) return res.status(404).json({ msg: 'Department not found' });

        const newTokenNum = dept.totalTokens + 1;

        const newQueueItem = new Queue({
            departmentId: dept.id,
            userId: req.user.id,
            tokenNumber: newTokenNum,
        });

        await newQueueItem.save();

        dept.totalTokens = newTokenNum;
        // Simple crowd level logic
        const pending = dept.totalTokens - dept.currentToken;
        if (pending > 20) dept.crowdLevel = 'High';
        else if (pending > 10) dept.crowdLevel = 'Medium';
        else dept.crowdLevel = 'Low';

        await dept.save();

        // Emit socket event (handled in index.js or via event emitter, for now just response)
        // In a real app, we'd emit here.

        res.json({ token: newTokenNum, estimatedWait: (pending * dept.avgWaitTimePerToken) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/queue/:deptId/next
// @desc    Call next token
// @access  Private (Dept Admin)
router.put('/:deptId/next', auth, async (req, res) => {
    // Check permission
    if (req.user.role !== 'dept_admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ msg: 'Permission denied' });
    }

    try {
        const dept = await Department.findById(req.params.deptId);
        if (!dept) return res.status(404).json({ msg: 'Department not found' });

        if (dept.currentToken < dept.totalTokens) {
            dept.currentToken += 1;
            dept.lastUpdated = Date.now();

            // Update Queue item status
            await Queue.findOneAndUpdate(
                { departmentId: dept.id, tokenNumber: dept.currentToken },
                { status: 'Serving', servedAt: Date.now() }
            );

            // Mark previous as completed
            if (dept.currentToken > 1) {
                await Queue.findOneAndUpdate(
                    { departmentId: dept.id, tokenNumber: dept.currentToken - 1 },
                    { status: 'Completed', completedAt: Date.now() }
                );
            }

            await dept.save();

            // Emit socket update
            const io = req.app.get('io');
            io.to(req.params.deptId).emit('queueUpdate', dept);

            res.json(dept);
        } else {
            res.status(400).json({ msg: 'No more tokens in queue' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
