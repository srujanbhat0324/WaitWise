const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Can be null if guest or walk-in
    },
    tokenNumber: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Serving', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
    servedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
});

module.exports = mongoose.model('Queue', queueSchema);
