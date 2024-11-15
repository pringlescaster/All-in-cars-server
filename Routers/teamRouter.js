import { Router } from "express";
import {
  addMember,
  deleteMember,
  getAllMembers,
  updateMember,
} from "../Controllers/teamController.js";

const router = Router();

router.post("/team/register", addMember);
router.get("/teams", getAllMembers);
router.put("/teams/update/:id", updateMember);
router.delete("/teams/delete/:id", deleteMember);


export default router;
