import { Router } from "express";
import carRouter from "./carRouter.js";
import newArrivalRouter from "./newArrivalRouter.js"

const router = Router();

router.use(carRouter)
router.use(newArrivalRouter)

export default router;