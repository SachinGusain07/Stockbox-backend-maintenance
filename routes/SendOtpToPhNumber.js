import express from 'express';
import { deleteUser, getUsers, requestOTP, verifyOTP } from '../controller/SendOtpToPhNumber.js';
import protectRoute from '../utils/protectRoute.js';

const SendOtpToPhNumberRouter = express.Router();

// Route for requesting OTP
SendOtpToPhNumberRouter.post('/request-otp',  requestOTP);

// Route for verifying OTP
SendOtpToPhNumberRouter.post('/verify-otp', verifyOTP);

// Route for getting all users
SendOtpToPhNumberRouter.get('/users',protectRoute , getUsers);

// Route for deleting a user
SendOtpToPhNumberRouter.delete('/user/:id', protectRoute ,  deleteUser);

export default SendOtpToPhNumberRouter;
