// routes/userRoutes.ts
import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import {
  addBoardMember,
  createBoard,
  createGroup,
  deleteGroup,
  getBoard,
  getBoardList,
  removeMember,
} from "../controllers/boardController";

const router = Router();
router.post("/addMember", authenticateUser, addBoardMember);
router.post("/removeMember", authenticateUser, removeMember);

router.post("/createBoard", authenticateUser, createBoard);
router.get("/getBoard", authenticateUser, getBoard);
router.get("/getBoardList", authenticateUser, getBoardList);
router.post("/createGroup", authenticateUser, createGroup);
router.delete("/deleteGroup", authenticateUser, deleteGroup);

export default router;
