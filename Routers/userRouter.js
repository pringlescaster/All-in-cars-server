import { Router } from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from "../Controllers/userController.js";
import { verifyToken } from "../Middleware/verifyToken.js";

const router = Router();

//Create
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/logout', logout);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword)


//get 
router.get('/check-auth', verifyToken, checkAuth)
export default router;