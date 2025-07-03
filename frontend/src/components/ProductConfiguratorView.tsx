import React, { useState, useEffect, useMemo } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "../../../shared/validators/product";
import { Property } from "../../../shared/validators/property";
import { PropertyVariant } from "../../../shared/validators/propertyVariant";
import { ProductSku } from "../../../shared/validators/productSku";
import VisualVariantSelector from "./VisualVariantSelector";
import { ProductProperty } from "shared/validators/product";
import { Multimedia } from "shared/validators/multimedia";

interface ProductConfiguratorViewProps {
  product: Product & {
    properties: (ProductProperty & {
      property: Property & {
        propertyVariants: (PropertyVariant & { image?: Multimedia | null })[];
      };
    })[];
    skus: (ProductSku & {
      image?: Multimedia | null;
      propertyVariants: {
        propertyVariant: PropertyVariant;
      }[];
    })[];
  };
}

const ProductConfiguratorView: React.FC<ProductConfiguratorViewProps> = ({ product }) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  useEffect(() => {
    const initialVariants: Record<string, string> = {};
    product.properties.forEach((prop) => {
      if (prop.property.propertyVariants.length > 0) {
        initialVariants[prop.property.id] = prop.property.propertyVariants[0].id;
      }
    });
    setSelectedVariants(initialVariants);
    if (product.properties.length > 0) {
      setActivePropertyId(product.properties[0].property.id);
    }
  }, [product]);

  const handleVariantChange = (propertyId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [propertyId]: variantId }));
  };

  const currentSku = useMemo(() => {
    const selectedVariantIds = new Set(Object.values(selectedVariants));
    // Ensure a variant is selected for every property before trying to find a SKU
    if (selectedVariantIds.size < product.properties.length) {
      return null;
    }

    return product.skus.find(sku => {
      if (sku.propertyVariants.length !== selectedVariantIds.size) {
        return false;
      }
      const skuVariantIds = new Set(sku.propertyVariants.map(pv => pv.propertyVariant.id));
      return sku.propertyVariants.every(pv => selectedVariantIds.has(pv.propertyVariant.id)) && selectedVariantIds.size === skuVariantIds.size;
    });
  }, [selectedVariants, product.skus, product.properties]);

  const imageUrl = useMemo(() => {
    // If we have a matching SKU with a specific image, use it.
    if (currentSku && currentSku.image) {
      return currentSku.image.url;
    }
    // Fallback to the main product image.
    return product.mainImage?.url ?? "https://placehold.co/600x400/EEE/31343C";
  }, [currentSku, product.mainImage]);

  const activeProperty = useMemo(() => {
    return product.properties.find(p => p.property.id === activePropertyId)?.property;
  }, [activePropertyId, product.properties]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode="contain"
        />
        {product.properties.map((prop) => (
          <TouchableOpacity
            key={prop.property.id}
            style={[styles.hotspot, { top: `${prop.hotspotY || 20}%`, left: `${prop.hotspotX || 20}%` }]}
            onPress={() => setActivePropertyId(prop.property.id)}
          >
            <View style={activePropertyId === prop.property.id ? styles.activeHotspotIndicator : styles.hotspotIndicator} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.optionsContainer}>
        <Text style={styles.activePropertyTitle}>{activeProperty?.name}</Text>
        {activeProperty && (
          <VisualVariantSelector
            property={activeProperty}
            selectedValue={selectedVariants[activeProperty.id]}
            onValueChange={(variantId) => handleVariantChange(activeProperty.id, variantId)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  optionsContainer: {
    height: 180,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  activePropertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  hotspot: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.7)',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  activeHotspotIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  }
});

export default ProductConfiguratorView;
