const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// @route   GET api/ai/predict/:deptId
// @desc    Get AI predictions for waiting time and crowd
// @access  Public
router.get('/predict/:deptId', async (req, res) => {
    try {
        const dept = await Department.findById(req.params.deptId);

        if (!dept) {
            return res.status(404).json({ msg: 'Department not found' });
        }

        // Real calculation based on queue data
        const tokensRemaining = dept.totalTokens - dept.currentToken;
        const estimatedWaitTime = tokensRemaining * dept.avgWaitTimePerToken;

        // Generate hourly forecast based on current crowd level
        const currentHour = new Date().getHours();
        const crowdForecast = [];

        for (let i = 0; i < 3; i++) {
            const hour = (currentHour + i) % 24;
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;

            // Simple heuristic: peak hours 10-12 and 14-16
            let level = 'Low';
            if ((hour >= 10 && hour <= 12) || (hour >= 14 && hour <= 16)) {
                level = 'High';
            } else if (hour >= 9 && hour <= 17) {
                level = 'Medium';
            }

            crowdForecast.push({ time: timeStr, level });
        }

        // Determine peak time
        const peakTime = dept.crowdLevel === 'High' ? 'Now' : '11:00 AM';

        // Alert if queue is too long
        let alert = null;
        if (tokensRemaining > 20) {
            alert = `High queue detected. ${tokensRemaining} people ahead. Consider visiting later.`;
        } else if (dept.isPaused) {
            alert = 'Queue is currently paused. Please check back later.';
        }

        res.json({
            estimatedWaitTime,
            crowdForecast,
            peakTime,
            alert,
            tokensRemaining,
            currentToken: dept.currentToken,
            totalTokens: dept.totalTokens,
            crowdLevel: dept.crowdLevel
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
