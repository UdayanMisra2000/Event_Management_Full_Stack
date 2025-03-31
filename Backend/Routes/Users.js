import express from 'express';
import authMiddleware from '../authMiddleware.js';
import { register, login, logout, updateUser, getUserById, registerWithUsername, getAvailability, updateAvailability } from '../Controllers/Users.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.put('/updateRegister/:id', authMiddleware, updateUser);
userRouter.put('/registerWithUsername/:id/:email', registerWithUsername);
userRouter.get('/getUser/:id', authMiddleware, getUserById);
userRouter.post('/login', login);
userRouter.post('/logout', logout); 
userRouter.get('/availability', authMiddleware, getAvailability);
userRouter.put('/availability', authMiddleware, updateAvailability);

export default userRouter;
