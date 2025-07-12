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
    const selectedVariantIds = Object.values(selectedVariants);

    let bestMatch = null;
    let maxMatchCount = 0;

    for (const sku of product.skus) {
      const skuVariantIds = sku.propertyVariants.map(pv => pv.propertyVariant.id);
      const matchCount = selectedVariantIds.filter(id => skuVariantIds.includes(id)).length;

      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestMatch = sku;
      } else if (matchCount === maxMatchCount && bestMatch) {
        // If match count is the same, prefer the one with fewer variants (more specific)
        if (skuVariantIds.length < bestMatch.propertyVariants.length) {
          bestMatch = sku;
        }
      }
    }

    return bestMatch;
  }, [selectedVariants, product.skus]);

  const imageUrl = useMemo(() => {
    if (currentSku && currentSku.image) {
      return currentSku.image.url;
    }
    return product.mainImage?.url ?? 'https://placehold.co/600x400/EEE/31343C';
  }, [currentSku, product.mainImage]);

  const totalPrice = useMemo(() => {
    const quantity = parseInt(customerData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return 0;
    }
    return (currentSku?.finalPrice ?? product.basePrice) * quantity;
  }, [currentSku, product.basePrice, customerData.quantity]);

  const handlePlaceOrder = async () => {
    try {
      const order = await placeOrder({ product, selectedVariants, customerData });
      navigation.navigate('Confirmation', { order });
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
        <Text style={styles.sku}>SKU: {currentSku?.skuCode ?? 'N/A'}</Text>
        <Text style={styles.price}>Unit Price: {currentSku?.finalPrice ?? product.basePrice} PLN</Text>
        <Text style={styles.price}>Quantity: {customerData.quantity}</Text>
        <Text style={styles.totalPrice}>Total Price: {totalPrice.toFixed(2)} PLN</Text>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          onChangeText={(text) => setCustomerData({ ...customerData, name: text })}
          value={customerData.name}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          onChangeText={(text) => setCustomerData({ ...customerData, email: text })}
          value={customerData.email}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          onChangeText={(text) => setCustomerData({ ...customerData, address: text })}
          value={customerData.address}
        />
        <Text style={styles.label}>Quantity:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quantity (e.g., 1)"
          onChangeText={(text) => setCustomerData({ ...customerData, quantity: text })}
          value={customerData.quantity}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Customer Comments (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="Add any comments here"
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
    textAlign: 'left',
  },
  sku: {
    fontSize: Fonts.sizes.body,
    color: Colors.darkGray,
    marginBottom: Spacing.small,
    textAlign: 'left',
  },
  price: {
    fontSize: Fonts.sizes.body,
    color: Colors.primary,
    marginBottom: Spacing.small,
    textAlign: 'left',
  },
  totalPrice: {
    fontSize: Fonts.sizes.subtitle,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.large,
    textAlign: 'left',
  },
  label: {
    fontSize: Fonts.sizes.body,
    color: Colors.text,
    marginBottom: Spacing.tiny,
    textAlign: 'left',
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