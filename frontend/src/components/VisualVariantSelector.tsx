import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Property } from '../../../shared/validators/property';
import { PropertyVariant } from '../../../shared/validators/propertyVariant';
import { Multimedia } from '../../../shared/validators/multimedia';

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
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  variantOption: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  variantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  variantName: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default VisualVariantSelector;
