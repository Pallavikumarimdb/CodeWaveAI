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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/users', user_routes_js_1.default);
app.use('/projects', project_routes_js_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*'
    }
});
io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = socket.handshake.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
        const projectId = socket.handshake.query.projectId;
        //@ts-ignore
        if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }
        //@ts-ignore
        socket.Project = yield user_db_js_1.ProjectModel.findById(projectId);
        if (!token) {
            return next(new Error('Authentication error'));
        }
        //@ts-ignore
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Authentication error'));
        }
        //@ts-ignore
        socket.User = decoded;
        next();
    }
    catch (error) {
        //@ts-ignore
        next(error);
    }
}));
io.on('connection', socket => {
    //@ts-ignore
    socket.roomId = socket.Project._id.toString();
    console.log('a user connected');
    //@ts-ignore
    socket.join(socket.roomId);
    socket.on('project-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        //@ts-ignore
        socket.broadcast.to(socket.roomId).emit('project-message', data);
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
    }));
    //     socket.on('disconnect', () => {
    //         console.log('user disconnected');
    //         socket.leave(socket.roomId)
    //     });
});
app.listen(3000);
