import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Property } from '../../../shared/validators/property';
import { PropertyVariant } from '../../../shared/validators/propertyVariant';
import { Multimedia } from '../../../shared/validators/multimedia';
import { Colors, Fonts, Spacing, BorderRadius } from '../constants/Theme';

interface VisualVariantSelectorProps {
  property: Property & {
    propertyVariants: (PropertyVariant & { image?: Multimedia | null })[];
  };
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const VisualVariantSelector: React.FC<VisualVariantSelectorProps> = ({ property, selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{property.name}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {property.propertyVariants.map((variant) => (
          <TouchableOpacity
            key={variant.id}
            style={[styles.variantOption, selectedValue === variant.id && styles.selectedOption]}
            onPress={() => onValueChange(variant.id)}
          >
            <Image
              source={{ uri: variant.image?.url ?? 'https://placehold.co/100x100/EEE/31343C' }}
              style={styles.variantImage}
              resizeMode="cover"
            />
            <Text style={styles.variantName}>{variant.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.medium,
  },
  label: {
    fontSize: Fonts.sizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.medium,
    marginLeft: Spacing.medium,
  },
  variantOption: {
    marginHorizontal: Spacing.small,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    padding: Spacing.small,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  selectedOption: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  variantImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.small,
  },
  variantName: {
    marginTop: Spacing.small,
    fontSize: Fonts.sizes.caption,
    textAlign: 'center',
    color: Colors.text,
  },
});

export default VisualVariantSelector;
