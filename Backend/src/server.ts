import express from 'express';
import userRoutes from './routes/user.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cors from 'cors';
import 'dotenv/config';
import projectRoutes from './routes/project.routes.js';

const app = express();

const allowedOrigins = [
    "http://localhost:3000", 
    "http://localhost:5173",  
    "https://code-wave-ai.vercel.app",  
    "https://vercel.com", 
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, 
    })
);

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/auto', aiRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});