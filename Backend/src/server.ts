import express from 'express';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {ProjectModel} from './db/user.db.js';
import projectRoutes from './routes/project.routes.js';



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);
app.use('/projects', projectRoutes);



app.get('/', (req, res) => {
    res.send('Hello World!');
});





const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


io.use(async (socket, next) => {

    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;

        //@ts-ignore
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }

        //@ts-ignore
        socket.Project = await ProjectModel.findById(projectId);


        if (!token) {
            return next(new Error('Authentication error'))
        }

        //@ts-ignore
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }

        //@ts-ignore
        socket.User = decoded;

        next();

    } catch (error) {
        //@ts-ignore
        next(error)
    }

})


io.on('connection', socket => {
    //@ts-ignore
    socket.roomId = socket.Project._id.toString()


    console.log('a user connected');



    //@ts-ignore
    socket.join(socket.roomId);

    socket.on('project-message', async data => {

        const message = data.message;

        const aiIsPresentInMessage = message.includes('@ai');
        //@ts-ignore
        socket.broadcast.to(socket.roomId).emit('project-message', data)

        // if (aiIsPresentInMessage) {


        //     const prompt = message.replace('@ai', '');

        //     const result = await generateResult(prompt);


        //     io.to(socket.roomId).emit('project-message', {
        //         message: result,
        //         sender: {
        //             _id: 'ai',
        //             email: 'AI'
        //         }
        //     })


        //     return
        // }


    })

//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         socket.leave(socket.roomId)
//     });
});














app.listen(3000);