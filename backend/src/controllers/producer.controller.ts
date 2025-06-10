import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Pobierz wszystkie produkty producenta
export const getProducerProducts = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    
    const products = await prisma.product.findMany({
      where: {
        sellerId: producerId
      },
      include: {
        availableStyles: true,
        availableMaterials: true,
        availableFinishes: true,
      }
    });
    
    return res.status(200).json({ products });
  } catch (error) {
    console.error('Błąd pobierania produktów producenta:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania produktów' 
    });
  }
};

// Pobierz szczegóły produktu producenta
export const getProducerProductDetails = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { productId } = req.params;
    
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: producerId
      },
      include: {
        availableStyles: true,
        availableMaterials: true,
        availableFinishes: true,
      }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    
    return res.status(200).json({ product });
  } catch (error) {
    console.error('Błąd pobierania szczegółów produktu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania szczegółów produktu' 
    });
  }
};

// Dodaj nowy produkt
export const createProduct = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { name, description, basePrice, category } = req.body;
    
    if (!name || !basePrice || !category) {
      return res.status(400).json({ message: 'Nazwa, cena bazowa i kategoria są wymagane' });
    }
    
    const product = await prisma.product.create({
      data: {
        sellerId: producerId,
        name,
        description,
        basePrice: parseFloat(basePrice),
        category
      }
    });
    
    return res.status(201).json({ 
      message: 'Produkt został utworzony pomyślnie',
      product 
    });
  } catch (error) {
    console.error('Błąd tworzenia produktu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas tworzenia produktu' 
    });
  }
};

// Aktualizuj produkt
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { productId } = req.params;
    const { name, description, basePrice, category } = req.body;
    
    // Sprawdź czy produkt istnieje i należy do producenta
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: producerId
      }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        basePrice: basePrice ? parseFloat(basePrice) : existingProduct.basePrice,
        category: category || existingProduct.category
      }
    });
    
    return res.status(200).json({ 
      message: 'Produkt został zaktualizowany pomyślnie',
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Błąd aktualizacji produktu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas aktualizacji produktu' 
    });
  }
};

// Usuń produkt
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { productId } = req.params;
    
    // Sprawdź czy produkt istnieje i należy do producenta
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: producerId
      }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    
    // Usuń produkt i wszystkie powiązane elementy (kaskadowo)
    await prisma.product.delete({
      where: {
        id: productId
      }
    });
    
    return res.status(200).json({ 
      message: 'Produkt został usunięty pomyślnie'
    });
  } catch (error) {
    console.error('Błąd usuwania produktu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas usuwania produktu' 
    });
  }
};

// Dodaj styl do produktu
export const addProductStyle = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { productId } = req.params;
    const { name, description, imageUrl, additionalPrice } = req.body;
    
    // Sprawdź czy produkt istnieje i należy do producenta
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: producerId
      }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    
    if (!name) {
      return res.status(400).json({ message: 'Nazwa stylu jest wymagana' });
    }
    
    const style = await prisma.productStyle.create({
      data: {
        productId,
        name,
        description,
        imageUrl,
        additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0
      }
    });
    
    return res.status(201).json({ 
      message: 'Styl został dodany pomyślnie',
      style 
    });
  } catch (error) {
    console.error('Błąd dodawania stylu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas dodawania stylu' 
    });
  }
};

// Dodaj materiał do produktu
export const addProductMaterial = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { productId } = req.params;
    const { name, description, imageUrl, additionalPrice } = req.body;
    
    // Sprawdź czy produkt istnieje i należy do producenta
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: producerId
      }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    
    if (!name) {
      return res.status(400).json({ message: 'Nazwa materiału jest wymagana' });
    }
    
    const material = await prisma.productMaterial.create({
      data: {
        productId,
        name,
        description,
        imageUrl,
        additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0
      }
    });
    
    return res.status(201).json({ 
      message: 'Materiał został dodany pomyślnie',
      material 
    });
  } catch (error) {
    console.error('Błąd dodawania materiału:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas dodawania materiału' 
    });
  }
};

// Dodaj wykończenie do produktu
export const addProductFinish = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { productId } = req.params;
    const { name, description, imageUrl, additionalPrice } = req.body;
    
    // Sprawdź czy produkt istnieje i należy do producenta
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: producerId
      }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    
    if (!name) {
      return res.status(400).json({ message: 'Nazwa wykończenia jest wymagana' });
    }
    
    const finish = await prisma.productFinish.create({
      data: {
        productId,
        name,
        description,
        imageUrl,
        additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0
      }
    });
    
    return res.status(201).json({ 
      message: 'Wykończenie zostało dodane pomyślnie',
      finish 
    });
  } catch (error) {
    console.error('Błąd dodawania wykończenia:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas dodawania wykończenia' 
    });
  }
};

// Pobierz zamówienia dla produktów producenta
export const getProducerOrders = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    
    // Pobierz wszystkie zamówienia, które zawierają produkty tego producenta
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: producerId
            }
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true,
            style: true,
            material: true,
            finish: true
          },
          where: {
            product: {
              sellerId: producerId
            }
          }
        }
      }
    });
    
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Błąd pobierania zamówień producenta:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania zamówień' 
    });
  }
};

// Aktualizuj status zamówienia
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const producerId = (req as any).user.id;
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status || !['processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Nieprawidłowy status zamówienia' });
    }
    
    // Sprawdź czy zamówienie zawiera produkty tego producenta
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            product: {
              sellerId: producerId
            }
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Zamówienie nie zostało znalezione' });
    }
    
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      }
    });
    
    return res.status(200).json({ 
      message: 'Status zamówienia został zaktualizowany pomyślnie',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Błąd aktualizacji statusu zamówienia:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas aktualizacji statusu zamówienia' 
    });
  }
};
