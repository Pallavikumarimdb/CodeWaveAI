import express from 'express';
import userRoutes from './routes/user.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {ProjectModel} from './db/schema.db';
import projectRoutes from './routes/project.routes.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/auto', aiRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        const projectId = socket.handshake.query.projectId as string;
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid or missing projectId'));
        }
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return next(new Error('Project not found'));
        }
        if (!token) {
            return next(new Error('Authentication token is missing'));
        }

        if (!process.env.JWT_SECRET) {
            return next(new Error('JWT_SECRET is not defined'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Invalid token'));
        }
        socket.data.project = project;
        socket.data.user = decoded;
        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
    }
});


io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user);

    const roomId = socket.data.project._id.toString();
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    socket.on('project-message', async (data) => {
        try {
            const { message } = data;
            console.log(`Received message in room ${roomId}:`, message);

            socket.broadcast.to(roomId).emit('project-message', data);

        } catch (error) {
            console.error('Error handling project-message:', error);
        }
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected from room: ${roomId}`);
        socket.leave(roomId);
    });
});



httpServer.listen(3000, () => {
    console.log('server started');
  });
  