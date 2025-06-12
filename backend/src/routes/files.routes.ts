import { Router } from 'express';
import * as FilesController from '../controllers/files.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Wszystkie endpointy wymagają autentykacji
router.use(authenticateJWT);

// Upload pliku
router.post('/upload', FilesController.upload.single('file'), FilesController.uploadFile);

// Pobierz listę plików i folderów
router.get('/', FilesController.getFiles);

// Usuń plik
router.delete('/file/:filename', FilesController.deleteFile);

// Utwórz folder
router.post('/folder', FilesController.createFolder);

// Usuń folder
router.delete('/folder/:folderName', FilesController.deleteFolder);

// Serwuj pliki statyczne (publiczne)
router.get('/:userId/*', FilesController.serveFile);

export default router;

