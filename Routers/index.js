import { Router } from "express";
import carRouter from "./carRouter.js";
import newArrivalRouter from "./newArrivalRouter.js"
import eventRouter from "./eventRouter.js"
import userRouter from "./userRouter.js"
import teamRouter from "./teamRouter.js"

const router = Router();

router.use(carRouter) 
router.use(newArrivalRouter)
router.use(eventRouter)
router.use(userRouter)
router.use(teamRouter)

export default router;