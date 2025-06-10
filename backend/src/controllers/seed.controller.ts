import { Request, Response } from 'express';
import { seedDatabase } from '../utils/seed';

export const seedDatabaseWithTestData = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.id;
    
    const result = await seedDatabase(sellerId);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Błąd podczas seedowania bazy danych:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas seedowania bazy danych' 
    });
  }
};
