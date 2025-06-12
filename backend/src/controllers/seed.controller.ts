import { Request, Response } from 'express';

export const seedDatabaseWithTestData = async (req: Request, res: Response) => {
  try {
    // Import dynamiczny aby uniknąć problemów z circular dependencies
    const { main } = await import('../utils/seed');
    
    await main();
    
    return res.status(200).json({ 
      message: 'Baza danych została pomyślnie zainicjalizowana danymi testowymi' 
    });
  } catch (error) {
    console.error('Błąd podczas seedowania bazy danych:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas seedowania bazy danych' 
    });
  }
};
