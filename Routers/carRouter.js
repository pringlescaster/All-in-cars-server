import { Router } from "express";
import { upload } from "../Config/multer.js";
import { addCar, getCars, getCar, deleteCar, updateCar } from "../Controllers/carController.js";

const router = Router();

// Create Operation (with multiple file upload)
router.post('/car/register', upload.single('image'), addCar);

// Read Operations
router.get('/cars', getCars);
router.get('/car/:id', getCar);

// Update Operation (with multiple file upload)
router.put('/car/:id', upload.single('image'), updateCar);

// Delete Operation
router.delete('/car/:id', deleteCar);

export default router;

