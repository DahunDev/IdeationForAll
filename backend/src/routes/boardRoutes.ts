// routes/userRoutes.ts
import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import {
  createBoard,
  createGroup,
  deleteGroup,
  getBoard,
  getBoardList,
} from "../controllers/boardController";

const router = Router();

router.post("/createBoard", authenticateUser, createBoard);
router.get("/getBoard", authenticateUser, getBoard);
router.get("/getBoardList", authenticateUser, getBoardList);
router.post("/createGroup", authenticateUser, createGroup);
router.delete("/deleteGroup", authenticateUser, deleteGroup);

export default router;
