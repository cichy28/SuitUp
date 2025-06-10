import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/services/auth';
import Navigation from './src/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // Funkcja do inicjalizacji aplikacji
  useEffect(() => {
    const initializeApp = async () => {
      // Tutaj można dodać kod inicjalizacyjny, np. sprawdzenie czy użytkownik jest zalogowany
      console.log('Inicjalizacja aplikacji...');
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
