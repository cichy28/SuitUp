import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import React, { useState, useEffect, useMemo } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product, ProductProperty } from "../../../shared/validators/product";
import { Property } from "../../../shared/validators/property";
import { PropertyVariant } from "../../../shared/validators/propertyVariant";
import { ProductSku } from "../../../shared/validators/productSku";
import VisualVariantSelector from "./VisualVariantSelector";
import HotspotImageView, { HotspotData } from "./HotspotImageView";
import { Colors, Fonts, Spacing, BorderRadius } from '../constants/Theme';

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
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
    if (currentSku && currentSku.image) {
      return currentSku.image.url;
    }
    return product.mainImage?.url ?? "https://placehold.co/600x400/EEE/31343C";
  }, [currentSku, product.mainImage]);

  const hotspots: HotspotData[] = useMemo(() => {
    return product.properties.map((prop, index) => ({
      id: prop.property.id,
      name: prop.property.name,
      value: selectedVariants[prop.property.id],
      relativeTop: 0.2 + (index * 0.15),
      relativeLeft: 0.2 + (index * 0.1),
    }));
  }, [product.properties, selectedVariants]);

  const handleHotspotPress = (hotspot: HotspotData) => {
    setActivePropertyId(hotspot.id as string);
  };

  const activeProperty = useMemo(() => {
    return product.properties.find(p => p.property.id === activePropertyId)?.property;
  }, [activePropertyId, product.properties]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <HotspotImageView
          source={{ uri: imageUrl }}
          aspectRatio={1} // You might need to adjust this
          hotspots={hotspots}
          onHotspotPress={handleHotspotPress}
        />
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
      <TouchableOpacity style={styles.finishButton} onPress={() => navigation.navigate('Summary', { product, selectedVariants })}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    padding: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  activePropertyTitle: {
    fontSize: Fonts.sizes.subtitle,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    marginBottom: Spacing.medium,
    color: Colors.text,
  },
  finishButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    margin: Spacing.medium,
  },
  finishButtonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.subtitle,
    fontWeight: Fonts.weights.bold,
  }
});
export default ProductConfiguratorView;