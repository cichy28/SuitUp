import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';
import seedRoutes from './routes/seed.routes';
import filesRoutes from './routes/files.routes';
import producerRoutes from './routes/producer.routes';
import config from './config/config';

// Inicjalizacja zmiennych środowiskowych
dotenv.config();

// Inicjalizacja Prisma
const prisma = new PrismaClient();

// Inicjalizacja Express
const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serwowanie plików statycznych z katalogu uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Logowanie żądań
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/producer', producerRoutes);

// Endpoint testowy
app.get('/', (req, res) => {
  res.json({ message: 'API Suit Creator działa poprawnie!' });
});

// Obsługa błędów
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Wystąpił błąd serwera',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

// Obsługa zamknięcia
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Połączenie z bazą danych zamknięte');
  process.exit(0);
});
