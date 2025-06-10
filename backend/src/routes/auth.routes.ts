import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Rejestracja i logowanie
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Chronione endpointy
router.get('/profile', authenticateJWT, AuthController.getProfile);

export default router;
