import express from 'express';
import { getUserData, loginUser, registerUser } from '../controllers/userController.js';
import auth from '../middleweare/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);

userRouter.get('/me',auth,getUserData)

export default userRouter;