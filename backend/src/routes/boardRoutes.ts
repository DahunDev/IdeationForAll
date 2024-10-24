// routes/userRoutes.ts
import { Router } from 'express';

import { authenticateUser } from '../middleware/authMiddleware';
import { createBoard } from '../controllers/boardController';

const router = Router();

router.post('/createBoard', authenticateUser, createBoard);

export default router;
