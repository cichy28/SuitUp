import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import ListItem from '../../components/ListItem';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import { colors, typography, spacing } from '../../styles/designTokens';

type OrdersScreenProps = {
  navigation: any;
};

const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  
  // Mock data for orders
  const orders = [
    { 
      id: 'ORD-1234', 
      date: '2025-06-01', 
      product: 'Marynarka damska klasyczna',
      producer: 'Eleganza Fashion',
      status: 'submitted',
      total: 749
    },
    { 
      id: 'ORD-1122', 
      date: '2025-05-25', 
      product: 'Spodnie damskie eleganckie',
      producer: 'Eleganza Fashion',
      status: 'processing',
      total: 429
    },
    { 
      id: 'ORD-1001', 
      date: '2025-05-15', 
      product: 'Kamizelka damska',
      producer: 'ModernSuit',
      status: 'completed',
      total: 379
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge text="Złożone" variant="primary" size="sm" />;
      case 'processing':
        return <Badge text="W realizacji" variant="secondary" size="sm" />;
      case 'completed':
        return <Badge text="Zrealizowane" variant="success" size="sm" />;
      case 'cancelled':
        return <Badge text="Anulowane" variant="danger" size="sm" />;
      default:
        return <Badge text={status} variant="neutral" size="sm" />;
    }
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} zł`;
  };

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie zamówień..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Twoje zamówienia</Text>

      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card 
              variant="outlined" 
              style={styles.orderCard}
              onPress={() => handleOrderPress(item.id)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{item.id}</Text>
                {getStatusBadge(item.status)}
              </View>
              
              <View style={styles.orderBody}>
                <Text style={styles.orderProduct}>{item.product}</Text>
                <Text style={styles.orderProducer}>{item.producer}</Text>
              </View>
              
              <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>{item.date}</Text>
                <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.orderListContent}
        />
      ) : (
        <EmptyState
          title="Brak zamówień"
          description="Nie masz jeszcze żadnych zamówień"
          icon={<Ionicons name="cart-outline" size={48} color={colors.textSecondary} />}
          actionLabel="Przeglądaj produkty"
          onAction={() => navigation.navigate('Products')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  orderId: {
    fontWeight: typography.h4.fontWeight,
    color: colors.textPrimary,
  },
  orderBody: {
    marginBottom: spacing.sm,
  },
  orderProduct: {
    color: colors.textPrimary,
  },
  orderProducer: {
    color: colors.textSecondary,
    fontSize: typography.small.fontSize,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  orderDate: {
    color: colors.textSecondary,
    fontSize: typography.small.fontSize,
  },
  orderTotal: {
    fontWeight: typography.h4.fontWeight,
    color: colors.primary,
  },
  orderListContent: {
    paddingBottom: spacing.xl,
  },
});

export default OrdersScreen;

