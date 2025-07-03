import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getProductDetails } from '../utils/api';
import { Product } from '../../../shared/validators/product';
import ProductConfiguratorView from '../components/ProductConfiguratorView';

type ProductConfiguratorScreenRouteProp = RouteProp<RootStackParamList, 'ProductConfigurator'>;

const ProductConfiguratorScreen = () => {
  const route = useRoute<ProductConfiguratorScreenRouteProp>();
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductDetails(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError('Failed to load product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found.</Text>;
  }

  return <ProductConfiguratorView product={product} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProductConfiguratorScreen;
