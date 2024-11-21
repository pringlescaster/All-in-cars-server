import { Router } from "express";
import { addToFavorites, bookVisitation, checkAuth, forgotPassword, getFavorites, login, logout, removeFromFavorites, resetPassword, signup, verifyEmail } from "../Controllers/userController.js";
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

//favorites
router.post("/favorites", verifyToken, addToFavorites)
router.get("/favorites", verifyToken, getFavorites);
router.delete("/favorites/:carId", verifyToken, removeFromFavorites)

//booking
router.post("/booking", verifyToken, bookVisitation)

export default router;