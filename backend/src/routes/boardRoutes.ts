// routes/userRoutes.ts
import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import { createBoard, getBoard } from "../controllers/boardController";

const router = Router();

router.post("/createBoard", authenticateUser, createBoard);
router.get("/getBoard", authenticateUser, getBoard);

export default router;
