// src/controllers/authController.ts
import { Request, Response } from 'express';
import { registerUser } from '../services/authService';

export const registerUserController = async (req: Request, res: Response): Promise<void> => {
    const { email, password, username } = req.body;
  
    try {
      const uid = await registerUser({ email, password, username });
      res.status(201).json({ message: 'User registered successfully', uid });
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific Firebase error for email already in use
        if (error.message.includes('email address is already in use')) {
          res.status(400).json({ message: 'The email address is already in use by another account.' });
        } else if (error.message.includes('the email address is improperly formatted')){
            res.status(400).json({ message: 'The email address is invalid.' });
        }
        
        else {
          res.status(500).json({ message: `Failed to register user: ${error.message}` });
        }
      } else {
        res.status(500).json({ message: `Failed to register user: ${String(error)}` });
      }
    }
  };