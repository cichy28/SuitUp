import { Router } from 'express';
import * as ProducerController from '../controllers/producer.controller';
import { authenticate } from '../middleware/auth.middleware';
import { isProducer } from '../middleware/producer.middleware';

const router = Router();

// Wszystkie endpointy wymagają autentykacji i roli producenta
router.use(authenticate);
router.use(isProducer);

// Zarządzanie produktami
router.get('/products', ProducerController.getProducerProducts);
router.get('/products/:productId', ProducerController.getProducerProductDetails);
router.post('/products', ProducerController.createProduct);
router.put('/products/:productId', ProducerController.updateProduct);
router.delete('/products/:productId', ProducerController.deleteProduct);

// Zarządzanie stylami produktów
router.post('/products/:productId/styles', ProducerController.addProductStyle);

// Zarządzanie materiałami produktów
router.post('/products/:productId/materials', ProducerController.addProductMaterial);

// Zarządzanie wykończeniami produktów
router.post('/products/:productId/finishes', ProducerController.addProductFinish);

// Zarządzanie zamówieniami
router.get('/orders', ProducerController.getProducerOrders);
router.put('/orders/:orderId/status', ProducerController.updateOrderStatus);

export default router;
