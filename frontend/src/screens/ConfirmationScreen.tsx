import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, Fonts, Spacing, BorderRadius } from '../constants/Theme';

type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'Confirmation'>;

const ConfirmationScreen = () => {
  const route = useRoute<ConfirmationScreenRouteProp>();
  const navigation = useNavigation();
  const { order } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank You!</Text>
      <Text style={styles.subtitle}>Your order has been placed successfully.</Text>
      <View style={styles.orderDetails}>
        <Text style={styles.orderNumber}>Order Number: #{order.orderNumber}</Text>
        <Text style={styles.emailConfirmation}>A confirmation email has been sent to {order.customer.email}.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.large,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Fonts.sizes.header,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.medium,
  },
  subtitle: {
    fontSize: Fonts.sizes.subtitle,
    color: Colors.text,
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  orderDetails: {
    marginBottom: Spacing.large,
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: Fonts.sizes.large,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  emailConfirmation: {
    fontSize: Fonts.sizes.body,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.extraLarge,
    borderRadius: BorderRadius.medium,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.subtitle,
    fontWeight: '700',
  },
});

export default ConfirmationScreen;