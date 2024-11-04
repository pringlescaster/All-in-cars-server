import { Router } from "express";
import carRouter from "./carRouter.js";
import newArrivalRouter from "./newArrivalRouter.js"
import eventRouter from "./eventRouter.js"
import userRouter from "./userRouter.js"

const router = Router();

router.use(carRouter) 
router.use(newArrivalRouter)
router.use(eventRouter)
router.use(userRouter)

export default router;