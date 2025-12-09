const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
        enum: ['token_next', 'token_previous', 'token_set', 'queue_pause', 'queue_resume', 'office_create', 'office_edit', 'office_delete', 'department_create', 'department_edit', 'department_delete', 'user_role_update'],
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        default: null,
    },
    officeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Office',
        default: null,
    },
    details: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
