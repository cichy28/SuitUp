import { Request, Response } from 'express';
import * as UserModel from '../models/user.model';

export const createBodyMeasurement = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { height, chest, waist, hips, shoulders, inseam } = req.body;
    
    if (!height || !chest || !waist || !hips || !shoulders) {
      return res.status(400).json({ message: 'Wszystkie podstawowe wymiary są wymagane' });
    }
    
    const measurementData = {
      userId,
      height: parseFloat(height),
      chest: parseFloat(chest),
      waist: parseFloat(waist),
      hips: parseFloat(hips),
      shoulders: parseFloat(shoulders),
      inseam: inseam ? parseFloat(inseam) : undefined
    };
    
    // Sugeruj typ sylwetki na podstawie pomiarów
    const bodyType = UserModel.suggestBodyType(measurementData);
    measurementData.bodyType = bodyType;
    
    const measurement = await UserModel.createBodyMeasurement(measurementData);
    
    return res.status(201).json({
      message: 'Pomiary ciała zapisane pomyślnie',
      measurement,
      suggestedBodyType: bodyType
    });
  } catch (error) {
    console.error('Błąd zapisywania pomiarów ciała:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania pomiarów ciała' 
    });
  }
};

export const getBodyMeasurement = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const measurement = await UserModel.getBodyMeasurement(userId);
    
    return res.status(200).json({ measurement });
  } catch (error) {
    console.error('Błąd pobierania pomiarów ciała:', error);
    return res.status(404).json({ 
      message: error instanceof Error ? error.message : 'Pomiary ciała nie znalezione' 
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { items, totalPrice } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Lista elementów zamówienia jest wymagana' });
    }
    
    if (!totalPrice) {
      return res.status(400).json({ message: 'Cena całkowita jest wymagana' });
    }
    
    const orderData = {
      userId,
      status: 'submitted', // Domyślny status dla nowego zamówienia
      totalPrice: parseFloat(totalPrice),
      items: items.map(item => ({
        productId: item.productId,
        styleId: item.styleId,
        materialId: item.materialId,
        finishId: item.finishId,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price)
      }))
    };
    
    const order = await UserModel.createOrder(orderData);
    
    return res.status(201).json({
      message: 'Zamówienie utworzone pomyślnie',
      order
    });
  } catch (error) {
    console.error('Błąd tworzenia zamówienia:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas tworzenia zamówienia' 
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const orders = await UserModel.getOrdersByUser(userId);
    
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Błąd pobierania zamówień użytkownika:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania zamówień' 
    });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const order = await UserModel.getOrderById(id);
    
    // Sprawdź czy zamówienie należy do użytkownika
    if (order.userId !== userId) {
      return res.status(403).json({ message: 'Brak dostępu do tego zamówienia' });
    }
    
    return res.status(200).json({ order });
  } catch (error) {
    console.error('Błąd pobierania szczegółów zamówienia:', error);
    return res.status(404).json({ 
      message: error instanceof Error ? error.message : 'Zamówienie nie znalezione' 
    });
  }
};
