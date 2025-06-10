import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import ListItem from '../../components/ListItem';
import Badge from '../../components/Badge';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

type ProfileScreenProps = {
  navigation: any;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  // Mock user data
  const user = {
    name: 'Anna Kowalska',
    email: 'anna.kowalska@example.com',
    phone: '123456789',
    type: 'client',
    measurements: {
      height: 170,
      bust: 90,
      waist: 70,
      hips: 95,
      inseam: 80,
      bodyType: 'hourglass'
    },
    joinDate: '2025-01-15'
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleEditMeasurements = () => {
    navigation.navigate('Measurements');
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout');
    navigation.navigate('Login');
  };

  const getBodyTypeName = (type: string) => {
    switch (type) {
      case 'hourglass': return 'Klepsydra';
      case 'pear': return 'Gruszka';
      case 'apple': return 'Jabłko';
      case 'rectangle': return 'Prostokąt';
      default: return 'Nieokreślony';
    }
  };

  return (
    <StyledScrollView className="flex-1 bg-neutral-50">
      <StyledView className="p-4">
        <StyledView className="flex-row items-center justify-between mb-6">
          <StyledText className="text-2xl font-bold text-neutral-800">Profil</StyledText>
          <Button 
            title="Edytuj" 
            onPress={handleEditProfile}
            size="sm"
            variant="outline"
          />
        </StyledView>

        <Card variant="elevated" className="mb-6">
          <StyledView className="items-center py-6">
            <StyledView className="w-20 h-20 rounded-full bg-primary bg-opacity-10 items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="#4a6ea9" />
            </StyledView>
            <StyledText className="text-xl font-bold text-neutral-800">{user.name}</StyledText>
            <StyledText className="text-neutral-500">{user.email}</StyledText>
            <Badge 
              text={user.type === 'client' ? 'Klient' : 'Producent'} 
              variant="primary" 
              size="sm" 
              className="mt-2"
            />
          </StyledView>
        </Card>

        <Section title="Dane kontaktowe" className="mb-6">
          <ListItem
            leftIcon="mail-outline"
            title="Email"
            subtitle={user.email}
          />
          <ListItem
            leftIcon="call-outline"
            title="Telefon"
            subtitle={user.phone || 'Nie podano'}
          />
          <ListItem
            leftIcon="calendar-outline"
            title="Data dołączenia"
            subtitle={user.joinDate}
          />
        </Section>

        {user.type === 'client' && user.measurements && (
          <Section title="Wymiary ciała" className="mb-6">
            <StyledView className="p-4">
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="text-neutral-600">Wzrost:</StyledText>
                <StyledText className="text-neutral-800">{user.measurements.height} cm</StyledText>
              </StyledView>
              
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="text-neutral-600">Obwód biustu:</StyledText>
                <StyledText className="text-neutral-800">{user.measurements.bust} cm</StyledText>
              </StyledView>
              
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="text-neutral-600">Obwód talii:</StyledText>
                <StyledText className="text-neutral-800">{user.measurements.waist} cm</StyledText>
              </StyledView>
              
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="text-neutral-600">Obwód bioder:</StyledText>
                <StyledText className="text-neutral-800">{user.measurements.hips} cm</StyledText>
              </StyledView>
              
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="text-neutral-600">Długość nogawki:</StyledText>
                <StyledText className="text-neutral-800">{user.measurements.inseam} cm</StyledText>
              </StyledView>
              
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="text-neutral-600">Typ sylwetki:</StyledText>
                <StyledText className="text-neutral-800">{getBodyTypeName(user.measurements.bodyType)}</StyledText>
              </StyledView>
              
              <Button
                title="Edytuj wymiary"
                onPress={handleEditMeasurements}
                variant="outline"
                fullWidth
                className="mt-2"
              />
            </StyledView>
          </Section>
        )}

        <Section title="Akcje" className="mb-8">
          <ListItem
            leftIcon="cart-outline"
            title="Moje zamówienia"
            subtitle="Zobacz historię zamówień"
            chevron
            onPress={handleViewOrders}
          />
          <ListItem
            leftIcon="log-out-outline"
            title="Wyloguj się"
            subtitle="Wyloguj się z aplikacji"
            onPress={handleLogout}
          />
        </Section>
      </StyledView>
    </StyledScrollView>
  );
};

export default ProfileScreen;

