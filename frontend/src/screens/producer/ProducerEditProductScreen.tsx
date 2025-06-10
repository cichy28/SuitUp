import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { producerAPI } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProducerProductsStackParamList } from '../../navigation';

type ProducerEditProductScreenProps = {
  navigation: NativeStackNavigationProp<ProducerProductsStackParamList, 'EditProduct'>;
  route: RouteProp<ProducerProductsStackParamList, 'EditProduct'>;
};

const ProducerEditProductScreen: React.FC<ProducerEditProductScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'jacket', name: 'Marynarka' },
    { id: 'pants', name: 'Spodnie' },
    { id: 'skirt', name: 'Spódnica' },
    { id: 'vest', name: 'Kamizelka' },
  ];

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await producerAPI.getProducerProductDetails(productId);
      const product = response.product;
      
      if (product) {
        setName(product.name);
        setDescription(product.description || '');
        setBasePrice(product.basePrice.toString());
        setCategory(product.category);
      } else {
        Alert.alert('Błąd', 'Nie znaleziono produktu');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Błąd pobierania szczegółów produktu:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać szczegółów produktu');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Walidacja
    if (!name.trim()) {
      Alert.alert('Błąd', 'Nazwa produktu jest wymagana');
      return;
    }

    if (!basePrice.trim() || isNaN(parseFloat(basePrice)) || parseFloat(basePrice) <= 0) {
      Alert.alert('Błąd', 'Cena bazowa musi być liczbą większą od zera');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const productData = {
        name: name.trim(),
        description: description.trim(),
        basePrice: parseFloat(basePrice),
        category
      };
      
      await producerAPI.updateProduct(productId, productData);
      
      Alert.alert(
        'Sukces',
        'Produkt został pomyślnie zaktualizowany',
        [
          { 
            text: 'OK', 
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Błąd aktualizacji produktu:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować produktu. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6ea9" />
        <Text style={styles.loadingText}>Ładowanie danych produktu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edytuj produkt</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nazwa produktu *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="np. Marynarka damska klasyczna"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Opis produktu</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Opisz swój produkt..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cena bazowa (zł) *</Text>
          <TextInput
            style={styles.input}
            value={basePrice}
            onChangeText={setBasePrice}
            placeholder="np. 299.99"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategoria *</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.id && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat.id && styles.categoryButtonTextActive
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Zapisz zmiany</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Zarządzanie opcjami produktu</Text>
        <Text style={styles.infoText}>
          Aby zarządzać stylami, materiałami i wykończeniami, wróć do widoku szczegółów produktu.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  categoryButtonActive: {
    backgroundColor: '#4a6ea9',
    borderColor: '#4a6ea9',
  },
  categoryButtonText: {
    color: '#333',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4a6ea9',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default ProducerEditProductScreen;
