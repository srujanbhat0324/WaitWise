const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office',
        required: true,
    },
    avgWaitTimePerToken: {
        type: Number, // in minutes
        default: 10,
    },
    currentToken: {
        type: Number,
        default: 0,
    },
    totalTokens: {
        type: Number,
        default: 0,
    },
    isPaused: {
        type: Boolean,
        default: false,
    },
    crowdLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Department', departmentSchema);
