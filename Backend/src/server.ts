import express from 'express';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {ProjectModel} from './db/user.db.js';
import projectRoutes from './routes/project.routes.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});


// io.on('connection', (socket) => {
//   console.log('socket connected');
// });




// const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);
app.use('/projects', projectRoutes);



app.get('/', (req, res) => {
    res.send('Hello World!');
});





// Middleware to authenticate and handle queries
io.use(async (socket, next) => {
    try {
        // Extract auth token and projectId from handshake data
        const token = socket.handshake.auth?.token;
        const projectId = socket.handshake.query.projectId as string;

        // Validate projectId
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid or missing projectId'));
        }

        // Retrieve project details from the database
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return next(new Error('Project not found'));
        }

        // Ensure token exists
        if (!token) {
            return next(new Error('Authentication token is missing'));
        }

        if (!process.env.JWT_SECRET) {
            return next(new Error('JWT_SECRET is not defined'));
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Invalid token'));
        }

        // Attach project and user details to the socket
        socket.data.project = project;
        socket.data.user = decoded;

        // Proceed to the connection handler
        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
    }
});

// Handle socket connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user);

    // Join the room corresponding to the project ID
    const roomId = socket.data.project._id.toString();
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Listen for messages
    socket.on('project-message', async (data) => {
        try {
            const { message } = data;
            console.log(`Received message in room ${roomId}:`, message);

            // Broadcast message to others in the room
            socket.broadcast.to(roomId).emit('project-message', data);

            // Check for AI mention
            // if (message.includes('@ai')) {
            //     const prompt = message.replace('@ai', '').trim();
            //     const aiResponse = await generateResult(prompt); // Your AI generation function

            //     // Emit AI response to the same room
            //     io.to(roomId).emit('project-message', {
            //         message: aiResponse,
            //         sender: {
            //             _id: 'ai',
            //             email: 'AI',
            //         },
            //     });
            // }
        } catch (error) {
            console.error('Error handling project-message:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected from room: ${roomId}`);
        socket.leave(roomId);
    });
});





httpServer.listen(3000, () => {
    console.log('server started');
  });
  




// app.listen(3000);