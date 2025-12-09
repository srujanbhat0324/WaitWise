const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Office = require('./models/Office');
const Department = require('./models/Department');
const Queue = require('./models/Queue');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Office.deleteMany({});
        await Department.deleteMany({});
        await Queue.deleteMany({});
        console.log('Cleared existing data');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'admin@waitwise.com',
            password: hashedPassword,
            role: 'super_admin'
        });

        const regularUser1 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            role: 'user'
        });

        const regularUser2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: hashedPassword,
            role: 'user'
        });

        console.log('Created users');

        // Create Offices
        const cityHospital = await Office.create({
            name: 'City General Hospital',
            address: '123 Main Street, Downtown',
            location: {
                type: 'Point',
                coordinates: [77.5946, 12.9716] // Bangalore coordinates
            },
            lat: 12.9716,
            lng: 77.5946,
            type: 'Hospital',
            adminId: superAdmin._id
        });

        const rtoOffice = await Office.create({
            name: 'RTO Bangalore Central',
            address: '456 MG Road, Central District',
            location: {
                type: 'Point',
                coordinates: [77.6033, 12.9698]
            },
            lat: 12.9698,
            lng: 77.6033,
            type: 'RTO',
            adminId: superAdmin._id
        });

        const bankBranch = await Office.create({
            name: 'State Bank Main Branch',
            address: '789 Commercial Street',
            location: {
                type: 'Point',
                coordinates: [77.6101, 12.9822]
            },
            lat: 12.9822,
            lng: 77.6101,
            type: 'Bank',
            adminId: superAdmin._id
        });

        console.log('Created offices');

        // Create Departments for Hospital
        const emergencyDept = await Department.create({
            name: 'Emergency',
            officeId: cityHospital._id,
            avgWaitTimePerToken: 15,
            currentToken: 12,
            totalTokens: 25,
            isPaused: false,
            crowdLevel: 'High'
        });

        const opdDept = await Department.create({
            name: 'OPD - General',
            officeId: cityHospital._id,
            avgWaitTimePerToken: 10,
            currentToken: 8,
            totalTokens: 15,
            isPaused: false,
            crowdLevel: 'Medium'
        });

        const labDept = await Department.create({
            name: 'Laboratory',
            officeId: cityHospital._id,
            avgWaitTimePerToken: 5,
            currentToken: 3,
            totalTokens: 5,
            isPaused: false,
            crowdLevel: 'Low'
        });

        // Create Departments for RTO
        const licenseDept = await Department.create({
            name: 'Driving License',
            officeId: rtoOffice._id,
            avgWaitTimePerToken: 20,
            currentToken: 5,
            totalTokens: 18,
            isPaused: false,
            crowdLevel: 'High'
        });

        const registrationDept = await Department.create({
            name: 'Vehicle Registration',
            officeId: rtoOffice._id,
            avgWaitTimePerToken: 15,
            currentToken: 10,
            totalTokens: 12,
            isPaused: false,
            crowdLevel: 'Low'
        });

        // Create Departments for Bank
        const accountsDept = await Department.create({
            name: 'Account Services',
            officeId: bankBranch._id,
            avgWaitTimePerToken: 8,
            currentToken: 7,
            totalTokens: 10,
            isPaused: false,
            crowdLevel: 'Medium'
        });

        const loansDept = await Department.create({
            name: 'Loans & Credit',
            officeId: bankBranch._id,
            avgWaitTimePerToken: 12,
            currentToken: 2,
            totalTokens: 8,
            isPaused: false,
            crowdLevel: 'Low'
        });

        console.log('Created departments');

        // Create Department Admins
        const emergencyAdmin = await User.create({
            name: 'Dr. Sarah Johnson',
            email: 'sarah@hospital.com',
            password: hashedPassword,
            role: 'dept_admin',
            departmentId: emergencyDept._id,
            officeId: cityHospital._id
        });

        const opdAdmin = await User.create({
            name: 'Dr. Mike Wilson',
            email: 'mike@hospital.com',
            password: hashedPassword,
            role: 'dept_admin',
            departmentId: opdDept._id,
            officeId: cityHospital._id
        });

        const licenseAdmin = await User.create({
            name: 'Rajesh Kumar',
            email: 'rajesh@rto.com',
            password: hashedPassword,
            role: 'dept_admin',
            departmentId: licenseDept._id,
            officeId: rtoOffice._id
        });

        console.log('Created department admins');

        // Create Queue Entries
        const queueEntries = [];

        // Emergency queue
        for (let i = 1; i <= 25; i++) {
            queueEntries.push({
                departmentId: emergencyDept._id,
                userId: i % 2 === 0 ? regularUser1._id : regularUser2._id,
                tokenNumber: i,
                status: i <= 11 ? 'Completed' : i === 12 ? 'Serving' : 'Pending',
                issuedAt: new Date(Date.now() - (25 - i) * 5 * 60000),
                servedAt: i <= 12 ? new Date(Date.now() - (25 - i) * 3 * 60000) : null,
                completedAt: i <= 11 ? new Date(Date.now() - (25 - i) * 2 * 60000) : null
            });
        }

        // OPD queue
        for (let i = 1; i <= 15; i++) {
            queueEntries.push({
                departmentId: opdDept._id,
                userId: i % 2 === 0 ? regularUser1._id : null,
                tokenNumber: i,
                status: i <= 7 ? 'Completed' : i === 8 ? 'Serving' : 'Pending',
                issuedAt: new Date(Date.now() - (15 - i) * 10 * 60000),
                servedAt: i <= 8 ? new Date(Date.now() - (15 - i) * 8 * 60000) : null,
                completedAt: i <= 7 ? new Date(Date.now() - (15 - i) * 6 * 60000) : null
            });
        }

        // License queue
        for (let i = 1; i <= 18; i++) {
            queueEntries.push({
                departmentId: licenseDept._id,
                userId: i % 3 === 0 ? regularUser2._id : null,
                tokenNumber: i,
                status: i <= 4 ? 'Completed' : i === 5 ? 'Serving' : 'Pending',
                issuedAt: new Date(Date.now() - (18 - i) * 20 * 60000),
                servedAt: i <= 5 ? new Date(Date.now() - (18 - i) * 15 * 60000) : null,
                completedAt: i <= 4 ? new Date(Date.now() - (18 - i) * 10 * 60000) : null
            });
        }

        await Queue.insertMany(queueEntries);
        console.log('Created queue entries');

        console.log('\n=== SEED DATA SUMMARY ===');
        console.log('\nLogin Credentials (password for all: password123):');
        console.log('Super Admin: admin@waitwise.com');
        console.log('Emergency Dept Admin: sarah@hospital.com');
        console.log('OPD Dept Admin: mike@hospital.com');
        console.log('RTO License Admin: rajesh@rto.com');
        console.log('Regular User 1: john@example.com');
        console.log('Regular User 2: jane@example.com');
        console.log('\nOffices Created: 3');
        console.log('- City General Hospital (3 departments)');
        console.log('- RTO Bangalore Central (2 departments)');
        console.log('- State Bank Main Branch (2 departments)');
        console.log('\nTotal Departments: 7');
        console.log('Total Queue Entries: ' + queueEntries.length);
        console.log('\n=========================\n');

        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
