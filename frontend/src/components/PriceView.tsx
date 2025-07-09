import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface PriceViewProps {
  skuBasePrice: number;
  finalPrice: number;
  priceMultiplier: number;
}

export const PriceView: React.FC<PriceViewProps> = ({
  skuBasePrice,
  finalPrice,
  priceMultiplier,
}) => {
  if (priceMultiplier < 1) {
    return (
      <Text style={styles.priceText}>
        <Text style={styles.crossedOutPrice}>${skuBasePrice.toFixed(2)}</Text>{' '}
        <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
      </Text>
    );
  } else {
    return (
      <Text style={styles.priceText}>${finalPrice.toFixed(2)}</Text>
    );
  }
};

const styles = StyleSheet.create({
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  crossedOutPrice: {
    textDecorationLine: 'line-through',
    color: Colors.light.tint,
    marginRight: 5,
  },
  finalPrice: {
    color: Colors.light.text,
  },
});
