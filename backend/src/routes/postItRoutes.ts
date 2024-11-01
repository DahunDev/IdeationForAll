// routes/userRoutes.ts
import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import { createPostIt, deletePostIt, updatePostItGroup } from "../controllers/postItController";

const router = Router();

router.post("/createPostIt", authenticateUser, createPostIt);
router.put("/updatePostItGroup", authenticateUser, updatePostItGroup);
router.delete("/deletePostIt", authenticateUser, deletePostIt)

export default router;
