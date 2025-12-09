const express = require('express');
const router = express.Router();
const Office = require('../models/Office');
const Department = require('../models/Department');
const { auth, requireSuperAdmin } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET api/office
// @desc    Get all offices or search by location
// @access  Public
router.get('/', async (req, res) => {
    const { lat, lng, radius } = req.query;

    try {
        if (lat && lng) {
            const distanceInMeters = (radius || 50) * 1000; // Default 50km
            const offices = await Office.find({
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)],
                        },
                        $maxDistance: distanceInMeters,
                    },
                },
            });
            return res.json(offices);
        }

        const offices = await Office.find();
        res.json(offices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/office
// @desc    Create an office
// @access  Private (Super Admin)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ msg: 'Permission denied' });
    }

    const { name, address, lat, lng, type } = req.body;

    try {
        const newOffice = new Office({
            name,
            address,
            location: {
                type: 'Point',
                coordinates: [lng, lat],
            },
            type,
            adminId: req.user.id,
        });

        const office = await newOffice.save();
        res.json(office);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/office/:id/departments
// @desc    Get departments for an office
// @access  Public
router.get('/:id/departments', async (req, res) => {
    try {
        const departments = await Department.find({ officeId: req.params.id });
        res.json(departments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/office/:id/departments
// @desc    Add department to office
// @access  Private (Super Admin or Office Admin)
router.post('/:id/departments', auth, async (req, res) => {
    // Check permissions (simplified for now)
    if (req.user.role !== 'super_admin' && req.user.role !== 'dept_admin') {
        // Ideally check if user is admin of THIS office
        return res.status(403).json({ msg: 'Permission denied' });
    }

    const { name, avgWaitTimePerToken } = req.body;

    try {
        const newDept = new Department({
            name,
            officeId: req.params.id,
            avgWaitTimePerToken,
        });

        const dept = await newDept.save();
        res.json(dept);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/office/:id
// @desc    Edit an office
// @access  Private (Super Admin)
router.put('/:id', requireSuperAdmin, async (req, res) => {
    const { name, address, lat, lng, type } = req.body;

    try {
        const office = await Office.findById(req.params.id);
        if (!office) {
            return res.status(404).json({ msg: 'Office not found' });
        }

        if (name) office.name = name;
        if (address) office.address = address;
        if (lat !== undefined && lng !== undefined) {
            office.lat = lat;
            office.lng = lng;
            office.location.coordinates = [lng, lat];
        }
        if (type) office.type = type;

        await office.save();

        // Log activity
        await ActivityLog.create({
            userId: req.user.id,
            action: 'office_edit',
            officeId: office._id,
            details: `Updated office: ${office.name}`
        });

        res.json(office);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/office/:id
// @desc    Delete an office
// @access  Private (Super Admin)
router.delete('/:id', requireSuperAdmin, async (req, res) => {
    try {
        const office = await Office.findById(req.params.id);
        if (!office) {
            return res.status(404).json({ msg: 'Office not found' });
        }

        // Delete all departments in this office
        await Department.deleteMany({ officeId: req.params.id });

        await Office.findByIdAndDelete(req.params.id);

        // Log activity
        await ActivityLog.create({
            userId: req.user.id,
            action: 'office_delete',
            officeId: req.params.id,
            details: `Deleted office: ${office.name}`
        });

        res.json({ msg: 'Office deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
