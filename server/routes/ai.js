const express = require('express');
const router = express.Router();

// @route   GET api/ai/predict/:deptId
// @desc    Get AI predictions for waiting time and crowd
// @access  Public
router.get('/predict/:deptId', (req, res) => {
    // Mock Antigravity AI response
    // In real scenario, this would call an external AI service or run a local model

    const mockPrediction = {
        estimatedWaitTime: Math.floor(Math.random() * (20 - 10 + 1) + 10), // 10-20 mins
        crowdForecast: [
            { time: '10:00 AM', level: 'Low' },
            { time: '11:00 AM', level: 'High' },
            { time: '12:00 PM', level: 'Medium' },
        ],
        peakTime: '11:45 AM',
        alert: null
    };

    // Randomly add an alert
    if (Math.random() > 0.7) {
        mockPrediction.alert = "Unusual rush detected. Expect delays.";
    }

    res.json(mockPrediction);
});

module.exports = router;
