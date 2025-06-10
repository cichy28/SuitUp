import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProductData {
  sellerId: string;
  name: string;
  description?: string;
  basePrice: number;
  category: string;
}

export interface ProductStyleData {
  productId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  additionalPrice?: number;
}

export interface ProductMaterialData {
  productId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  additionalPrice?: number;
}

export interface ProductFinishData {
  productId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  additionalPrice?: number;
}

export const createProduct = async (productData: ProductData) => {
  try {
    const product = await prisma.product.create({
      data: productData
    });
    return product;
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (category?: string) => {
  try {
    const whereClause = category ? { category } : {};
    
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        availableStyles: true,
        availableMaterials: true,
        availableFinishes: true
      }
    });
    
    return products;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        availableStyles: true,
        availableMaterials: true,
        availableFinishes: true
      }
    });
    
    if (!product) {
      throw new Error('Produkt nie znaleziony');
    }
    
    return product;
  } catch (error) {
    throw error;
  }
};

export const addProductStyle = async (styleData: ProductStyleData) => {
  try {
    const style = await prisma.productStyle.create({
      data: styleData
    });
    return style;
  } catch (error) {
    throw error;
  }
};

export const addProductMaterial = async (materialData: ProductMaterialData) => {
  try {
    const material = await prisma.productMaterial.create({
      data: materialData
    });
    return material;
  } catch (error) {
    throw error;
  }
};

export const addProductFinish = async (finishData: ProductFinishData) => {
  try {
    const finish = await prisma.productFinish.create({
      data: finishData
    });
    return finish;
  } catch (error) {
    throw error;
  }
};
