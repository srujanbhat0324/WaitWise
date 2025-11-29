require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Make io accessible in routes
app.set('io', io);

// Database Connection
// Use a local MongoDB URI if MONGO_URI is not provided, or a dummy one for now if user hasn't set it up.
// ideally user should provide this in .env
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/waitwise';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/office', require('./routes/office'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/ai', require('./routes/ai'));

// Socket.IO
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinDepartment', (deptId) => {
        socket.join(deptId);
        console.log(`Client joined department: ${deptId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
