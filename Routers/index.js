import { Router } from "express";
import carRouter from "./carRouter.js";
import newArrivalRouter from "./newArrivalRouter.js"
import eventRouter from "./eventRouter.js"

const router = Router();

router.use(carRouter)
router.use(newArrivalRouter)
router.use(eventRouter)

export default router;