import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import { colors, typography, spacing } from '../../styles/designTokens';

type OrderDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      orderId: string;
    };
  };
};

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [loading, setLoading] = React.useState(false);
  
  // Mock order data
  const order = {
    id: orderId,
    date: '2025-06-01',
    product: 'Marynarka damska klasyczna',
    producer: 'Eleganza Fashion',
    status: 'submitted',
    total: 749,
    style: 'Slim fit',
    material: 'Wełna 100%',
    finish: 'Premium',
    customer: {
      name: 'Anna Kowalska',
      email: 'anna.kowalska@example.com',
      phone: '123456789',
      address: 'ul. Przykładowa 123',
      city: 'Warszawa',
      postalCode: '00-001'
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge text="Złożone" variant="primary" />;
      case 'processing':
        return <Badge text="W realizacji" variant="secondary" />;
      case 'completed':
        return <Badge text="Zrealizowane" variant="success" />;
      case 'cancelled':
        return <Badge text="Anulowane" variant="danger" />;
      default:
        return <Badge text={status} variant="neutral" />;
    }
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} zł`;
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie szczegółów zamówienia..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zamówienie {order.id}</Text>
        {getStatusBadge(order.status)}
      </View>

      <Card style={styles.productDetailsCard}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Szczegóły produktu</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Produkt:</Text>
            <Text style={styles.detailValue}>{order.product}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Producent:</Text>
            <Text style={styles.detailValue}>{order.producer}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Styl:</Text>
            <Text style={styles.detailValue}>{order.style}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Materiał:</Text>
            <Text style={styles.detailValue}>{order.material}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wykończenie:</Text>
            <Text style={styles.detailValue}>{order.finish}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Razem:</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
          </View>
        </View>
      </Card>

      <Section title="Dane zamawiającego">
        <View style={styles.cardContent}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Imię i nazwisko:</Text>
            <Text style={styles.detailValue}>{order.customer.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{order.customer.email}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Telefon:</Text>
            <Text style={styles.detailValue}>{order.customer.phone}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Adres:</Text>
            <Text style={styles.detailValue}>{order.customer.address}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Miasto:</Text>
            <Text style={styles.detailValue}>{order.customer.city}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kod pocztowy:</Text>
            <Text style={styles.detailValue}>{order.customer.postalCode}</Text>
          </View>
        </View>
      </Section>

      <Section title="Status zamówienia">
        <View style={styles.cardContent}>
          <View style={styles.statusRow}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Data zamówienia</Text>
              <Text style={styles.statusValue}>{order.date}</Text>
            </View>
          </View>
          
          <View style={styles.statusRow}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={styles.statusValue}>
                {order.status === 'submitted' ? 'Zamówienie zostało złożone' :
                 order.status === 'processing' ? 'Zamówienie jest w trakcie realizacji' :
                 order.status === 'completed' ? 'Zamówienie zostało zrealizowane' :
                 order.status === 'cancelled' ? 'Zamówienie zostało anulowane' :
                 'Status nieznany'}
              </Text>
            </View>
          </View>
        </View>
      </Section>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate('Orders')}
          variant="outline"
          fullWidth
        >
          Wróć do zamówień
        </Button>
      </View>
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
  productDetailsCard: {
    marginBottom: spacing.lg,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    color: colors.textSecondary,
  },
  detailValue: {
    color: colors.textPrimary,
    fontWeight: typography.h4.fontWeight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusTextContainer: {
    marginLeft: spacing.sm,
  },
  statusLabel: {
    color: colors.textPrimary,
    fontWeight: typography.h4.fontWeight,
  },
  statusValue: {
    color: colors.textSecondary,
  },
  buttonContainer: {
    padding: spacing.md,
  },
});

export default OrderDetailScreen;

