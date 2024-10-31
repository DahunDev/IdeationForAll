// routes/userRoutes.ts
import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import { createPostIt } from "../controllers/postItController";

const router = Router();

router.post("/createPostIt", authenticateUser, createPostIt);

export default router;
