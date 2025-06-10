import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import ListItem from '../../components/ListItem';
import EmptyState from '../../components/EmptyState';
import { colors, typography, spacing } from '../../styles/designTokens';

type ProducerHomeScreenProps = {
  navigation: any;
};

const ProducerHomeScreen: React.FC<ProducerHomeScreenProps> = ({ navigation }) => {
  // Mock data for dashboard
  const stats = {
    products: 12,
    pendingOrders: 5,
    completedOrders: 24,
    revenue: 15750
  };

  const recentOrders = [
    { id: '1', customer: 'Anna Kowalska', status: 'submitted', date: '2025-06-01', total: 1250 },
    { id: '2', customer: 'Jan Nowak', status: 'processing', date: '2025-05-28', total: 980 },
    { id: '3', customer: 'Maria Wiśniewska', status: 'completed', date: '2025-05-25', total: 1450 }
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

  const handleViewAllOrders = () => {
    navigation.navigate('Orders');
  };

  const handleViewAllProducts = () => {
    navigation.navigate('Products');
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.headerButtons}>
          <Button 
            onPress={handleAddProduct}
            size="sm"
            leftIcon="add-outline"
          >
            Dodaj produkt
          </Button>
        </View>
      </View>

      <Section title="Podsumowanie">
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Card style={styles.summaryCard}>
              <Ionicons name="shirt-outline" size={28} color={colors.primary} />
              <Text style={styles.summaryValue}>{stats.products}</Text>
              <Text style={styles.summaryLabel}>Produkty</Text>
            </Card>
          </View>
          
          <View style={styles.summaryItem}>
            <Card style={styles.summaryCard}>
              <Ionicons name="time-outline" size={28} color={colors.warning} />
              <Text style={styles.summaryValue}>{stats.pendingOrders}</Text>
              <Text style={styles.summaryLabel}>Oczekujące zamówienia</Text>
            </Card>
          </View>
          
          <View style={styles.summaryItem}>
            <Card style={styles.summaryCard}>
              <Ionicons name="checkmark-circle-outline" size={28} color={colors.success} />
              <Text style={styles.summaryValue}>{stats.completedOrders}</Text>
              <Text style={styles.summaryLabel}>Zrealizowane zamówienia</Text>
            </Card>
          </View>
          
          <View style={styles.summaryItem}>
            <Card style={styles.summaryCard}>
              <Ionicons name="cash-outline" size={28} color={colors.primary} />
              <Text style={styles.summaryValue}>{formatCurrency(stats.revenue)}</Text>
              <Text style={styles.summaryLabel}>Przychód</Text>
            </Card>
          </View>
        </View>
      </Section>

      <Section 
        title="Ostatnie zamówienia" 
        style={styles.recentOrdersSection}
      >
        {recentOrders.length > 0 ? (
          <>
            {recentOrders.map((order) => (
              <ListItem
                key={order.id}
                title={`Zamówienie #${order.id}`}
                subtitle={`${order.customer} • ${formatCurrency(order.total)}`}
                rightComponent={() => getStatusBadge(order.status)}
                onPress={() => handleOrderPress(order.id)}
                chevron
              />
            ))}
            <View style={styles.viewAllButtonContainer}>
              <Button
                onPress={handleViewAllOrders}
                variant="outline"
                size="sm"
              >
                Zobacz wszystkie zamówienia
              </Button>
            </View>
          </>
        ) : (
          <EmptyState
            title="Brak zamówień"
            description="Nie masz jeszcze żadnych zamówień"
            icon={<Ionicons name="cart-outline" size={48} color={colors.textSecondary} />}
          />
        )}
      </Section>

      <Section 
        title="Twoje produkty" 
        style={styles.yourProductsSection}
      >
        <View style={styles.manageProductsButtonContainer}>
          <Button
            onPress={handleViewAllProducts}
            variant="primary"
            leftIcon="grid-outline"
          >
            Zarządzaj produktami
          </Button>
        </View>
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  summaryItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  summaryValue: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  summaryLabel: {
    color: colors.textSecondary,
  },
  recentOrdersSection: {
    marginTop: spacing.lg,
  },
  viewAllButtonContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  yourProductsSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  manageProductsButtonContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
});

export default ProducerHomeScreen;

