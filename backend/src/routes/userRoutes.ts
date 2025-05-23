// routes/userRoutes.ts
import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import {
  getUserBoards,
  updateEmail,
  updateUsername,
} from "../controllers/userController";

const router = Router();

router.post("/getUserBoards", authenticateUser, getUserBoards);
router.put("/updateEmail", authenticateUser, updateEmail);
router.put("/updateUsername", authenticateUser, updateUsername);

export default router;
