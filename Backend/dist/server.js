"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_db_js_1 = require("./db/user.db.js");
const project_routes_js_1 = __importDefault(require("./routes/project.routes.js"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});
// io.on('connection', (socket) => {
//   console.log('socket connected');
// });
// const app = express();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/users', user_routes_js_1.default);
app.use('/projects', project_routes_js_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Middleware to authenticate and handle queries
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Extract auth token and projectId from handshake data
        const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
        const projectId = socket.handshake.query.projectId;
        // Validate projectId
        if (!projectId || !mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid or missing projectId'));
        }
        // Retrieve project details from the database
        const project = yield user_db_js_1.ProjectModel.findById(projectId);
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Invalid token'));
        }
        // Attach project and user details to the socket
        socket.data.project = project;
        socket.data.user = decoded;
        // Proceed to the connection handler
        next();
    }
    catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
    }
}));
// Handle socket connection
io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user);
    // Join the room corresponding to the project ID
    const roomId = socket.data.project._id.toString();
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    // Listen for messages
    socket.on('project-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        catch (error) {
            console.error('Error handling project-message:', error);
        }
    }));
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
