import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Property } from '../../../shared/validators/property';
import { PropertyVariant } from '../../../shared/validators/propertyVariant';

interface VariantSelectorProps {
  property: Property & {
    propertyVariants: PropertyVariant[];
  };
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ property, selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{property.name}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onValueChange(itemValue as string)}
        style={styles.picker}
      >
        {property.propertyVariants.map((variant) => (
          <Picker.Item key={variant.id} label={variant.name} value={variant.id} />
        ))}
      </Picker>
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
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 50,
  },
});

export default VariantSelector;