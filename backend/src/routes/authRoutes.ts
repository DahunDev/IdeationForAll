// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUserController } from '../controllers/authController';

const router = Router();

router.post('/register', registerUserController);

export default router;
