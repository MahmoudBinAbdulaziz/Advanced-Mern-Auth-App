import express from 'express';
import { signup,signin,logout,verifyEmail,forgotPassword,resetPassword,checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();
router.get("/check-auth", verifyToken, checkAuth);
router.post('/login', signin);
router.post('/sign-up', signup);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email", verifyEmail);
router.get('/logout', logout);




export default router;