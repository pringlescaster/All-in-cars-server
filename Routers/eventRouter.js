import { Router } from "express";
import { addEvent, getEvents, getSingleEvent , deleteEvent} from "../Controllers/eventController.js"

const router = Router();

router.post('/events/register', addEvent);
router.get('/events', getEvents);
router.get('/events/:id', getSingleEvent);
router.get('/events/:id', deleteEvent);

export default router;