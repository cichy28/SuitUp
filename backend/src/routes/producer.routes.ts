import { Router } from 'express';
import * as ProducerController from '../controllers/producer.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isProducer } from '../middleware/producer.middleware';

const router = Router();

// Wszystkie endpointy wymagają autentykacji i roli producenta
router.use(authenticateJWT);
router.use(isProducer);

// Zarządzanie produktami
router.get('/products', ProducerController.getProducerProducts);
router.get('/products/:productId', ProducerController.getProducerProductDetails);
router.post('/products', ProducerController.createProduct);
router.put('/products/:productId', ProducerController.updateProduct);
router.delete('/products/:productId', ProducerController.deleteProduct);

// NOWE ENDPOINTY - Zarządzanie właściwościami produktu przez producenta

// Zarządzanie stylami
router.get('/styles', ProducerController.getProducerStyles);
router.post('/styles', ProducerController.addProducerStyle);

// Zarządzanie materiałami
router.get('/materials', ProducerController.getProducerMaterials);
router.post('/materials', ProducerController.addProducerMaterial);

// Zarządzanie wykończeniami
router.get('/finishes', ProducerController.getProducerFinishes);
router.post('/finishes', ProducerController.addProducerFinish);

// Zarządzanie wariantami produktu
router.get('/products/:productId/variants', ProducerController.getVariants);
router.post('/products/:productId/variants/generate', ProducerController.generateVariants);
router.put('/variants/:variantId/images', ProducerController.updateVariantImage);

// STARE ENDPOINTY - zachowane dla kompatybilności wstecznej (przestarzałe)
router.post('/products/:productId/styles', ProducerController.addProductStyle);
router.post('/products/:productId/materials', ProducerController.addProductMaterial);
router.post('/products/:productId/finishes', ProducerController.addProductFinish);

// Zarządzanie zamówieniami
router.get('/orders', ProducerController.getProducerOrders);
router.put('/orders/:orderId/status', ProducerController.updateOrderStatus);

export default router;
