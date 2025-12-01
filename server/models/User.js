const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'dept_admin', 'super_admin'],
        default: 'user',
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        default: null, // Only for dept_admin
    },
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office',
        default: null, // For super_admin (manages whole office) or dept_admin
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
