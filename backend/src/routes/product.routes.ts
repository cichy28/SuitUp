import { Router } from 'express';
import * as ProductController from '../controllers/product.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Publiczne endpointy
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// Chronione endpointy (tylko dla producentów/sprzedawców)
router.post('/', authenticateJWT, ProductController.createProduct);
router.post('/style', authenticateJWT, ProductController.addProductStyle);
router.post('/material', authenticateJWT, ProductController.addProductMaterial);
router.post('/finish', authenticateJWT, ProductController.addProductFinish);

export default router;
