import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Wszystkie endpointy wymagają autoryzacji
router.use(authenticateJWT);

// Pomiary ciała
router.post('/measurements', UserController.createBodyMeasurement);
router.get('/measurements', UserController.getBodyMeasurement);

// Zamówienia
router.post('/orders', UserController.createOrder);
router.get('/orders', UserController.getUserOrders);
router.get('/orders/:id', UserController.getOrderDetails);

export default router;
