import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BodyMeasurementData {
  userId: string;
  height: number;
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  inseam?: number;
  bodyType?: string;
}

export interface OrderData {
  userId: string;
  status: string;
  totalPrice: number;
  items: OrderItemData[];
}

export interface OrderItemData {
  productId: string;
  styleId?: string;
  materialId?: string;
  finishId?: string;
  quantity: number;
  price: number;
}

export const createBodyMeasurement = async (measurementData: BodyMeasurementData) => {
  try {
    // Sprawdź czy użytkownik już ma pomiary
    const existingMeasurement = await prisma.bodyMeasurement.findUnique({
      where: { userId: measurementData.userId }
    });

    if (existingMeasurement) {
      // Aktualizuj istniejące pomiary
      return await prisma.bodyMeasurement.update({
        where: { userId: measurementData.userId },
        data: measurementData
      });
    } else {
      // Utwórz nowe pomiary
      return await prisma.bodyMeasurement.create({
        data: measurementData
      });
    }
  } catch (error) {
    throw error;
  }
};

export const getBodyMeasurement = async (userId: string) => {
  try {
    const measurement = await prisma.bodyMeasurement.findUnique({
      where: { userId }
    });
    
    if (!measurement) {
      throw new Error('Pomiary ciała nie znalezione');
    }
    
    return measurement;
  } catch (error) {
    throw error;
  }
};

export const suggestBodyType = (measurements: BodyMeasurementData): string => {
  const { shoulders, chest, waist, hips } = measurements;
  
  // Prosta logika sugerowania typu sylwetki na podstawie proporcji
  if (shoulders > hips + 5) {
    return 'inverted triangle'; // Odwrócony trójkąt
  } else if (hips > shoulders + 5) {
    return 'pear'; // Gruszka
  } else if (waist < chest - 10 && waist < hips - 10) {
    return 'hourglass'; // Klepsydra
  } else if (Math.abs(shoulders - hips) < 5 && (waist < chest - 7)) {
    return 'rectangle'; // Prostokąt z wcięciem
  } else {
    return 'apple'; // Jabłko
  }
};

export const createOrder = async (orderData: OrderData) => {
  try {
    // Transakcja do utworzenia zamówienia i jego elementów
    const order = await prisma.$transaction(async (prisma) => {
      // Utwórz zamówienie
      const newOrder = await prisma.order.create({
        data: {
          userId: orderData.userId,
          status: orderData.status,
          totalPrice: orderData.totalPrice,
          items: {
            create: orderData.items.map(item => ({
              productId: item.productId,
              styleId: item.styleId,
              materialId: item.materialId,
              finishId: item.finishId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: true
        }
      });
      
      return newOrder;
    });
    
    return order;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByUser = async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            style: true,
            material: true,
            finish: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return orders;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            style: true,
            material: true,
            finish: true
          }
        }
      }
    });
    
    if (!order) {
      throw new Error('Zamówienie nie znalezione');
    }
    
    return order;
  } catch (error) {
    throw error;
  }
};
