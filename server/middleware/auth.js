const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Basic authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        req.userRole = user.role;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Super admin only
const requireSuperAdmin = async (req, res, next) => {
    try {
        await auth(req, res, () => { });

        if (req.userRole !== 'super_admin') {
            return res.status(403).json({ msg: 'Access denied. Super admin only.' });
        }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Authentication failed' });
    }
};

// Department admin or super admin
const requireDeptAdmin = async (req, res, next) => {
    try {
        await auth(req, res, () => { });

        if (req.userRole !== 'dept_admin' && req.userRole !== 'super_admin') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Authentication failed' });
    }
};

// Any authenticated user
const requireAuth = auth;

module.exports = { auth, requireSuperAdmin, requireDeptAdmin, requireAuth };
