import { Router } from 'express';
import * as SeedController from '../controllers/seed.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Endpoint do seedowania bazy danych (tylko dla zalogowanych użytkowników)
router.post('/database', authenticateJWT, SeedController.seedDatabaseWithTestData);

export default router;
