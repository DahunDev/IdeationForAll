// routes/userRoutes.ts
import { Router } from 'express';

import { authenticateUser } from '../middleware/authMiddleware';
import { createBoard } from '../controllers/boardController';
import { createPostIt } from '../services/postItService';

const router = Router();

router.post('/createPostIt', authenticateUser, createPostIt);

export default router;
