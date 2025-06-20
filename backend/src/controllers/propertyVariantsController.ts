import { Request, Response } from 'express';
import prisma from '../db';
import { CreatePropertyVariantInputSchema, UpdatePropertyVariantInputSchema } from '../../shared/validators/propertyVariant';
import { z } from 'zod';

// Get all property variants
export const getAllPropertyVariants = async (req: Request, res: Response) => {
  try {
    const propertyVariants = await prisma.propertyVariant.findMany({
      include: {
        property: true, // Include related Property
        image: { // Include related Multimedia (image)
          select: { id: true, url: true, altText: true } // Select specific multimedia fields
        },
        productSkus: { // Include linked ProductSkuPropertyVariant records
           include: {
             productSku: true // Include details of the linked ProductSku
           }
        }
      }
    });
    res.status(200).json(propertyVariants);
  } catch (error: any) {
    console.error("Error fetching property variants:", error);
    res.status(500).json({ message: 'Error fetching property variants', error: error.message });
  }
};

// Get property variant by ID
export const getPropertyVariantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const propertyVariant = await prisma.propertyVariant.findUnique({
      where: { id },
      include: {
        property: true,
        image: {
          select: { id: true, url: true, altText: true }
        },
        productSkus: {
           include: {
             productSku: true
           }
        }
      }
    });

    if (!propertyVariant) {
      return res.status(404).json({ message: 'Property Variant not found' });
    }

    res.status(200).json(propertyVariant);
  } catch (error: any) {
    console.error(`Error fetching property variant with ID ${id}:`, error);
    res.status(500).json({ message: `Error fetching property variant with ID ${id}`, error: error.message });
  }
};

// Create a new property variant
export const createPropertyVariant = async (req: Request, res: Response) => {
  try {
    const propertyVariantData = CreatePropertyVariantInputSchema.parse(req.body);

    const newPropertyVariant = await prisma.propertyVariant.create({
      data: propertyVariantData,
       include: { // Include relations in the response
        property: true,
        image: {
          select: { id: true, url: true, altText: true }
        }
      }
    });

    res.status(201).json(newPropertyVariant);
  } catch (error: any) {
     if (error.code === 'P2003') { // Invalid propertyId or imageId
         return res.status(400).json({ message: 'Invalid property ID or image ID' });
     }
     // Consider adding handling for unique constraints if needed, though none are defined in schema for name+propertyId
    console.error("Error creating property variant:", error);
    res.status(500).json({ message: 'Error creating property variant', error: error.message });
  }
};

// Update a property variant
export const updatePropertyVariant = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const propertyVariantData = UpdatePropertyVariantInputSchema.parse(req.body);

    const updatedPropertyVariant = await prisma.propertyVariant.update({
      where: { id },
      data: propertyVariantData,
       include: { // Include relations in the response
        property: true,
        image: {
          select: { id: true, url: true, altText: true }
        }
      }
    });

    res.status(200).json(updatedPropertyVariant);
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma error code for record not found
      return res.status(404).json({ message: 'Property Variant not found' });
    }
     if (error.code === 'P2003') { // Invalid propertyId or imageId
         return res.status(400).json({ message: 'Invalid property ID or image ID' });
     }
    console.error(`Error updating property variant with ID ${id}:`, error);
    res.status(500).json({ message: `Error updating property variant with ID ${id}`, error: error.message });
  }
};

// Delete a property variant
export const deletePropertyVariant = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Note: Deleting a PropertyVariant might fail if it's still referenced by
    // ProductSkuPropertyVariant depending on your schema's onDelete behavior.
    // Your schema has `onDelete: Cascade` for ProductSkuPropertyVariant,
    // so related records should be deleted automatically.

    const deletedPropertyVariant = await prisma.propertyVariant.delete({
      where: { id },
       include: { // Include relations in the response
        property: true,
        image: {
          select: { id: true, url: true, altText: true }
        }
      }
    });

    res.status(200).json({ message: 'Property Variant deleted successfully', propertyVariant: deletedPropertyVariant });
  } catch (error: any) {
     if (error.code === 'P2025') { // Prisma error code for record not found
      return res.status(404).json({ message: 'Property Variant not found' });
    }
     if (error.code === 'P2003') { // Foreign key constraint failure (less likely with Cascade on ProductSkuPropertyVariant)
         return res.status(409).json({ message: 'Cannot delete property variant because it is referenced by other records with Restrict onDelete' });
     }
    console.error(`Error deleting property variant with ID ${id}:`, error);
    res.status(500).json({ message: `Error deleting property variant with ID ${id}`, error: error.message });
  }
};

// TODO: Consider adding endpoints for managing the link between ProductSku and PropertyVariant
// These might be part of the ProductSku routes, but dedicated endpoints here are also possible.
// e.g., GET /api/property-variants/:variantId/product-skus (to get SKUs linked to this variant)
