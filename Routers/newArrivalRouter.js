import { Router } from "express";
import { addRecent, getNewArrival, getOneArrival, updateArrival, deleteArrival } from "../Controllers/newArrivalController.js";


const router = Router();

//Create
router.post('/newarrival/register', addRecent);

//Read
router.get('/newarrival/allnewarrivals', getNewArrival);
router.get('/newarrival/:id', getOneArrival);

//Update
router.put('/newarrival/:id', updateArrival);

//delete
router.delete('/newarrival/:id', deleteArrival)

export default router;


