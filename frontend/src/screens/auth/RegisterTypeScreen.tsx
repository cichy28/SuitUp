import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import ListItem from '../../components/ListItem';

type RegisterTypeScreenProps = {
  navigation: any;
};

const RegisterTypeScreen: React.FC<RegisterTypeScreenProps> = ({ navigation }) => {
  const [selectedType, setSelectedType] = React.useState<'client' | 'producer' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      navigation.navigate('Register', { userType: selectedType });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView className="flex-1 bg-neutral-50">
      <View className="p-6 flex-1">
        <View className="items-center mb-8 mt-6">
          <Text className="text-3xl font-bold text-primary mb-2">SUIT CREATOR</Text>
          <Text className="text-neutral-500 text-center">
            Wybierz typ konta, który najlepiej odpowiada Twoim potrzebom
          </Text>
        </View>

        <Section>
          <View className="mb-4">
            <Card 
              variant={selectedType === 'client' ? 'elevated' : 'outlined'}
              className={selectedType === 'client' ? 'border-2 border-primary' : ''}
              onPress={() => setSelectedType('client')}
            >
              <View className="items-center py-4">
                <View className="w-16 h-16 rounded-full bg-primary bg-opacity-10 items-center justify-center mb-3">
                  <Ionicons name="person-outline" size={30} color="#4a6ea9" />
                </View>
                <Text className="text-xl font-bold text-neutral-800">Klient</Text>
                <Text className="text-neutral-600 text-center mt-2 px-4">
                  Przeglądaj i zamawiaj spersonalizowane ubrania od producentów
                </Text>
              </View>
            </Card>
          </View>

          <View className="mb-4">
            <Card 
              variant={selectedType === 'producer' ? 'elevated' : 'outlined'}
              className={selectedType === 'producer' ? 'border-2 border-primary' : ''}
              onPress={() => setSelectedType('producer')}
            >
              <View className="items-center py-4">
                <View className="w-16 h-16 rounded-full bg-primary bg-opacity-10 items-center justify-center mb-3">
                  <Ionicons name="business-outline" size={30} color="#4a6ea9" />
                </View>
                <Text className="text-xl font-bold text-neutral-800">Producent</Text>
                <Text className="text-neutral-600 text-center mt-2 px-4">
                  Oferuj swoje produkty i zarządzaj zamówieniami od klientów
                </Text>
              </View>
            </Card>
          </View>
        </Section>

        <View className="mt-6">
          <Button
            title="Kontynuuj"
            onPress={handleContinue}
            fullWidth
            disabled={!selectedType}
            className="mb-4"
          />
          <Button
            title="Wróć do logowania"
            onPress={handleLogin}
            variant="outline"
            fullWidth
          />
        </View>

        <View className="mt-8 items-center">
          <Text className="text-neutral-400 text-sm">
            © 2025 Suit Creator. Wszelkie prawa zastrzeżone.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterTypeScreen;

