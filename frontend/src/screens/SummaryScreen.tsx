import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Product } from '../../../shared/validators/product';
import { placeOrder } from '../utils/api';
import { Colors, Fonts, Spacing, BorderRadius } from '../constants/Theme';

type SummaryScreenRouteProp = RouteProp<RootStackParamList, 'Summary'>;

const SummaryScreen = () => {
  const route = useRoute<SummaryScreenRouteProp>();
  const navigation = useNavigation();
  const { product, selectedVariants } = route.params;
  const [customerData, setCustomerData] = useState({ name: '', email: '', address: '', comment: '', quantity: '1' });

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
    return product.mainImage?.url ?? 'https://placehold.co/600x400/EEE/31343C';
  }, [currentSku, product.mainImage]);

  const handlePlaceOrder = async () => {
    try {
      await placeOrder({ product, selectedVariants, customerData });
      Alert.alert('Success', 'Order placed successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Order Summary</Text>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="contain" />
        </View>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.sku}>SKU: {currentSku?.sku ?? 'N/A'}</Text>
        <Text style={styles.price}>Price: {currentSku?.price ?? product.basePrice} PLN</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setCustomerData({ ...customerData, name: text })}
          value={customerData.name}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setCustomerData({ ...customerData, email: text })}
          value={customerData.email}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          onChangeText={(text) => setCustomerData({ ...customerData, address: text })}
          value={customerData.address}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (e.g., 1)"
          onChangeText={(text) => setCustomerData({ ...customerData, quantity: text })}
          value={customerData.quantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Customer Comments (optional)"
          onChangeText={(text) => setCustomerData({ ...customerData, comment: text })}
          value={customerData.comment}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.medium,
  },
  title: {
    fontSize: Fonts.sizes.title,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.medium,
    textAlign: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 200, // Fixed height for the image container
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.medium,
    borderRadius: BorderRadius.medium,
    overflow: 'hidden', // Clip image if it overflows
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: Fonts.sizes.subtitle,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  sku: {
    fontSize: Fonts.sizes.body,
    color: Colors.darkGray,
    marginBottom: Spacing.small,
  },
  price: {
    fontSize: Fonts.sizes.body,
    color: Colors.primary,
    marginBottom: Spacing.large,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    borderRadius: BorderRadius.small,
    fontSize: Fonts.sizes.body,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.subtitle,
    fontWeight: '700',
  },
});

export default SummaryScreen;