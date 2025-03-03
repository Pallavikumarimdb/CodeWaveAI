import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/user.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cors from 'cors';
import 'dotenv/config';
import projectRoutes from './routes/project.routes.js';

const app=express();
app.use(express.json());
app.use(cors());


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