import { Request, Response, NextFunction } from 'express';

/**
 * Middleware sprawdzający czy użytkownik ma rolę producenta
 */
export const isProducer = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Brak autoryzacji' });
    }
    
    if (user.userType !== 'producer') {
      return res.status(403).json({ message: 'Brak uprawnień. Wymagana rola producenta.' });
    }
    
    next();
  } catch (error) {
    console.error('Błąd weryfikacji roli producenta:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas weryfikacji uprawnień' 
    });
  }
};
