const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['Hospital', 'RTO', 'Bank', 'Other'],
        default: 'Other',
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create 2dsphere index for geolocation queries
officeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Office', officeSchema);
