import express from 'express';
const app = express();
import 'dotenv/config';
import mongoose from 'mongoose'
import userRouter from './Routes/Users.js';
import eventRouter from './Routes/Events.js';
import cookieParser from 'cookie-parser'
import authMiddleware from './authMiddleware.js';
import cors from 'cors'
app.use(cors(
    {
        origin: 'https://fascinating-cocada-83389d.netlify.app',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

app.use(express.json());
app.use(cookieParser());
app.use('/users', userRouter);
app.use('/events', authMiddleware, eventRouter);

const PORT = process.env.PORT || 3000;
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the environment variables.');
    process.exit(1); // Exit the application
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error(error));

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
    console.log(mongoose.version);
})
