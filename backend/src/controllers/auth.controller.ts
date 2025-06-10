import { Request, Response } from 'express';
import * as AuthModel from '../models/auth.model';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, userType } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email i hasło są wymagane' });
    }
    
    // Sprawdź czy userType jest poprawny
    const validUserType = userType === 'producer' ? 'producer' : 'client';
    
    const result = await AuthModel.registerUser({ 
      email, 
      password, 
      name, 
      userType: validUserType 
    });
    
    return res.status(201).json({
      message: 'Rejestracja zakończona pomyślnie',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        userType: result.user.userType
      },
      token: result.token
    });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas rejestracji' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email i hasło są wymagane' });
    }
    
    const result = await AuthModel.loginUser(email, password);
    
    return res.status(200).json({
      message: 'Logowanie zakończone pomyślnie',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        userType: result.user.userType
      },
      token: result.token
    });
  } catch (error) {
    console.error('Błąd logowania:', error);
    return res.status(401).json({ 
      message: error instanceof Error ? error.message : 'Nieprawidłowe dane logowania' 
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const user = await AuthModel.getUserById(userId);
    
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
        bodyMeasurements: user.userType === 'client' ? user.bodyMeasurements : undefined
      }
    });
  } catch (error) {
    console.error('Błąd pobierania profilu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania profilu' 
    });
  }
};
