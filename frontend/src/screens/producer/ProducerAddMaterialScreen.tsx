import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { producerAPI } from '../../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProducerProductsStackParamList } from '../../navigation';

type ProducerAddMaterialScreenProps = {
  navigation: NativeStackNavigationProp<ProducerProductsStackParamList, 'AddMaterial'>;
  route: RouteProp<ProducerProductsStackParamList, 'AddMaterial'>;
};

const ProducerAddMaterialScreen: React.FC<ProducerAddMaterialScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalPrice, setAdditionalPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Walidacja
    if (!name.trim()) {
      Alert.alert('Błąd', 'Nazwa materiału jest wymagana');
      return;
    }

    if (additionalPrice && (isNaN(parseFloat(additionalPrice)) || parseFloat(additionalPrice) < 0)) {
      Alert.alert('Błąd', 'Dodatkowa cena musi być liczbą nieujemną');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const materialData = {
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0
      };
      
      await producerAPI.addProductMaterial(productId, materialData);
      
      Alert.alert(
        'Sukces',
        'Materiał został pomyślnie dodany',
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
      console.error('Błąd dodawania materiału:', error);
      Alert.alert('Błąd', 'Nie udało się dodać materiału. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dodaj nowy materiał</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nazwa materiału *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="np. Wełna merino"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Opis materiału</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Opisz materiał..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>URL zdjęcia</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/image.jpg"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dodatkowa cena (zł)</Text>
          <TextInput
            style={styles.input}
            value={additionalPrice}
            onChangeText={setAdditionalPrice}
            placeholder="np. 100"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Dodaj materiał</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Wskazówki</Text>
        <Text style={styles.infoText}>
          • Materiał określa z czego wykonany jest produkt{'\n'}
          • Dodaj zdjęcie, aby klienci mogli zobaczyć teksturę i kolor materiału{'\n'}
          • Jeśli materiał wymaga dodatkowych kosztów, określ je w polu "Dodatkowa cena"
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

export default ProducerAddMaterialScreen;
