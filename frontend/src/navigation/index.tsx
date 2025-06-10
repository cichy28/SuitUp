import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/auth';

// Importy ekranów klienta (istniejące)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RegisterTypeScreen from '../screens/auth/RegisterTypeScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import MeasurementsScreen from '../screens/main/MeasurementsScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import ConfiguratorScreen from '../screens/products/ConfiguratorScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import CheckoutScreen from '../screens/orders/CheckoutScreen';

// Importy ekranów producenta (nowe)
import ProducerHomeScreen from '../screens/producer/ProducerHomeScreen';
import ProducerProductsScreen from '../screens/producer/ProducerProductsScreen';
import ProducerProductDetailScreen from '../screens/producer/ProducerProductDetailScreen';
import ProducerAddProductScreen from '../screens/producer/ProducerAddProductScreen';
import ProducerEditProductScreen from '../screens/producer/ProducerEditProductScreen';
import ProducerAddStyleScreen from '../screens/producer/ProducerAddStyleScreen';
import ProducerAddMaterialScreen from '../screens/producer/ProducerAddMaterialScreen';
import ProducerAddFinishScreen from '../screens/producer/ProducerAddFinishScreen';
import ProducerOrdersScreen from '../screens/producer/ProducerOrdersScreen';
import ProducerOrderDetailScreen from '../screens/producer/ProducerOrderDetailScreen';
import ProducerProfileScreen from '../screens/producer/ProducerProfileScreen';

// Definicje typów dla nawigacji
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RegisterType: undefined;
};

// Typy dla klienta
export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  Profile: undefined;
  Orders: undefined;
};

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: { productId: string };
  Configurator: { productId: string };
  Checkout: { configuration: any };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Measurements: undefined;
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
};

// Typy dla producenta
export type ProducerTabParamList = {
  Dashboard: undefined;
  Products: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type ProducerProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: { productId: string };
  AddProduct: undefined;
  EditProduct: { productId: string };
  AddStyle: { productId: string };
  AddMaterial: { productId: string };
  AddFinish: { productId: string };
};

export type ProducerOrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
};

// Tworzenie nawigatorów
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const ProductsStack = createNativeStackNavigator<ProductsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();

// Nawigatory dla producenta
const ProducerTab = createBottomTabNavigator<ProducerTabParamList>();
const ProducerProductsStack = createNativeStackNavigator<ProducerProductsStackParamList>();
const ProducerOrdersStack = createNativeStackNavigator<ProducerOrdersStackParamList>();

// Nawigator dla produktów klienta
const ProductsNavigator = () => {
  return (
    <ProductsStack.Navigator>
      <ProductsStack.Screen 
        name="ProductsList" 
        component={ProductsScreen} 
        options={{ title: 'Katalog produktów' }}
      />
      <ProductsStack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Szczegóły produktu' }}
      />
      <ProductsStack.Screen 
        name="Configurator" 
        component={ConfiguratorScreen} 
        options={{ title: 'Konfigurator' }}
      />
      <ProductsStack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ title: 'Zamówienie' }}
      />
    </ProductsStack.Navigator>
  );
};

// Nawigator dla profilu klienta
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Mój profil' }}
      />
      <ProfileStack.Screen 
        name="Measurements" 
        component={MeasurementsScreen} 
        options={{ title: 'Moje wymiary' }}
      />
    </ProfileStack.Navigator>
  );
};

// Nawigator dla zamówień klienta
const OrdersNavigator = () => {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen 
        name="OrdersList" 
        component={OrdersScreen} 
        options={{ title: 'Moje zamówienia' }}
      />
      <OrdersStack.Screen 
        name="OrderDetail" 
        component={OrderDetailScreen} 
        options={{ title: 'Szczegóły zamówienia' }}
      />
    </OrdersStack.Navigator>
  );
};

// Nawigator dla produktów producenta
const ProducerProductsNavigator = () => {
  return (
    <ProducerProductsStack.Navigator>
      <ProducerProductsStack.Screen 
        name="ProductsList" 
        component={ProducerProductsScreen} 
        options={{ title: 'Moje produkty' }}
      />
      <ProducerProductsStack.Screen 
        name="ProductDetail" 
        component={ProducerProductDetailScreen} 
        options={{ title: 'Szczegóły produktu' }}
      />
      <ProducerProductsStack.Screen 
        name="AddProduct" 
        component={ProducerAddProductScreen} 
        options={{ title: 'Dodaj produkt' }}
      />
      <ProducerProductsStack.Screen 
        name="EditProduct" 
        component={ProducerEditProductScreen} 
        options={{ title: 'Edytuj produkt' }}
      />
      <ProducerProductsStack.Screen 
        name="AddStyle" 
        component={ProducerAddStyleScreen} 
        options={{ title: 'Dodaj styl' }}
      />
      <ProducerProductsStack.Screen 
        name="AddMaterial" 
        component={ProducerAddMaterialScreen} 
        options={{ title: 'Dodaj materiał' }}
      />
      <ProducerProductsStack.Screen 
        name="AddFinish" 
        component={ProducerAddFinishScreen} 
        options={{ title: 'Dodaj wykończenie' }}
      />
    </ProducerProductsStack.Navigator>
  );
};

// Nawigator dla zamówień producenta
const ProducerOrdersNavigator = () => {
  return (
    <ProducerOrdersStack.Navigator>
      <ProducerOrdersStack.Screen 
        name="OrdersList" 
        component={ProducerOrdersScreen} 
        options={{ title: 'Zamówienia' }}
      />
      <ProducerOrdersStack.Screen 
        name="OrderDetail" 
        component={ProducerOrderDetailScreen} 
        options={{ title: 'Szczegóły zamówienia' }}
      />
    </ProducerOrdersStack.Navigator>
  );
};

// Główny nawigator z zakładkami dla klienta
const ClientNavigator = () => {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Strona główna', headerShown: false }}
      />
      <MainTab.Screen 
        name="Products" 
        component={ProductsNavigator} 
        options={{ title: 'Produkty', headerShown: false }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{ title: 'Profil', headerShown: false }}
      />
      <MainTab.Screen 
        name="Orders" 
        component={OrdersNavigator} 
        options={{ title: 'Zamówienia', headerShown: false }}
      />
    </MainTab.Navigator>
  );
};

// Główny nawigator z zakładkami dla producenta
const ProducerNavigator = () => {
  return (
    <ProducerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <ProducerTab.Screen 
        name="Dashboard" 
        component={ProducerHomeScreen} 
        options={{ title: 'Panel główny', headerShown: false }}
      />
      <ProducerTab.Screen 
        name="Products" 
        component={ProducerProductsNavigator} 
        options={{ title: 'Produkty', headerShown: false }}
      />
      <ProducerTab.Screen 
        name="Orders" 
        component={ProducerOrdersNavigator} 
        options={{ title: 'Zamówienia', headerShown: false }}
      />
      <ProducerTab.Screen 
        name="Profile" 
        component={ProducerProfileScreen} 
        options={{ title: 'Profil', headerShown: false }}
      />
    </ProducerTab.Navigator>
  );
};

// Główny komponent nawigacji
const Navigation = () => {
  const { isAuthenticated, loading, isProducer } = useAuth();

  if (loading) {
    // Tutaj można dodać ekran ładowania
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        isProducer ? <ProducerNavigator /> : <ClientNavigator />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="RegisterType" component={RegisterTypeScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
