import { Router } from "express";
import { signup } from "../Controllers/userController.js";

const router = Router();

//Create
router.post('/signup', signup);

export default router;