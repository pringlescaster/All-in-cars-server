import { Router } from "express";
import { login, logout, signup, verifyEmail } from "../Controllers/userController.js";


const router = Router();

//Create
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/logout', logout)
router.post('/login', login)

export default router;