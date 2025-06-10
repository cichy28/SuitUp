import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import { colors, typography, spacing } from '../../styles/designTokens';

type ConfiguratorScreenProps = {
  navigation: any;
  route: {
    params: {
      productId: string;
      selectedStyle: string;
      selectedMaterial: string;
      selectedFinish: string;
    };
  };
};

const ConfiguratorScreen: React.FC<ConfiguratorScreenProps> = ({ navigation, route }) => {
  const { productId, selectedStyle, selectedMaterial, selectedFinish } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'front' | 'back' | 'side'>('front');
  
  // Mock product data
  const product = {
    id: productId,
    name: 'Marynarka damska klasyczna',
    description: 'Elegancka marynarka damska w klasycznym kroju, idealna do personalizacji według potrzeb klienta.',
    producer: 'Eleganza Fashion',
    category: 'jacket',
    basePrice: 599,
    styles: [
      { id: '1', name: 'Klasyczny', priceModifier: 0 },
      { id: '2', name: 'Slim fit', priceModifier: 50 },
      { id: '3', name: 'Oversize', priceModifier: 30 },
    ],
    materials: [
      { id: '1', name: 'Wełna 100%', priceModifier: 100 },
      { id: '2', name: 'Wełna z poliestrem', priceModifier: 0 },
      { id: '3', name: 'Bawełna', priceModifier: 50 },
      { id: '4', name: 'Len', priceModifier: 80 },
      { id: '5', name: 'Jedwab', priceModifier: 150 },
    ],
    finishes: [
      { id: '1', name: 'Standardowe', priceModifier: 0 },
      { id: '2', name: 'Premium', priceModifier: 100 },
    ],
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = product.basePrice;
    
    const style = product.styles.find(s => s.id === selectedStyle);
    if (style) total += style.priceModifier;
    
    const material = product.materials.find(m => m.id === selectedMaterial);
    if (material) total += material.priceModifier;
    
    const finish = product.finishes.find(f => f.id === selectedFinish);
    if (finish) total += finish.priceModifier;
    
    return total;
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} zł`;
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout', { 
      productId,
      selectedStyle,
      selectedMaterial,
      selectedFinish,
      totalPrice: calculateTotalPrice()
    });
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie konfiguratora..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Konfigurator</Text>
      </View>

      <Card style={styles.configuratorCard}>
        <View style={styles.visualizationContainer}>
          {/* Placeholder for product visualization */}
          <Ionicons name="shirt-outline" size={80} color={colors.textSecondary} />
          <Text style={styles.visualizationText}>Wizualizacja {currentView === 'front' ? 'przód' : currentView === 'back' ? 'tył' : 'bok'}</Text>
        </View>
        
        <View style={styles.viewButtonsContainer}>
          <Button
            onPress={() => setCurrentView('front')}
            variant={currentView === 'front' ? 'primary' : 'outline'}
            size="sm"
            style={styles.viewButton}
          >
            Przód
          </Button>
          <Button
            onPress={() => setCurrentView('back')}
            variant={currentView === 'back' ? 'primary' : 'outline'}
            size="sm"
            style={styles.viewButton}
          >
            Tył
          </Button>
          <Button
            onPress={() => setCurrentView('side')}
            variant={currentView === 'side' ? 'primary' : 'outline'}
            size="sm"
            style={styles.viewButton}
          >
            Bok
          </Button>
        </View>
      </Card>

      <Section title="Twoja konfiguracja">
        <View style={styles.configurationDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Produkt:</Text>
            <Text style={styles.detailValue}>{product.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Styl:</Text>
            <Text style={styles.detailValue}>
              {product.styles.find(s => s.id === selectedStyle)?.name || ''}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Materiał:</Text>
            <Text style={styles.detailValue}>
              {product.materials.find(m => m.id === selectedMaterial)?.name || ''}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wykończenie:</Text>
            <Text style={styles.detailValue}>
              {product.finishes.find(f => f.id === selectedFinish)?.name || ''}
            </Text>
          </View>
        </View>
      </Section>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cena bazowa:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(product.basePrice)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Styl:</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(product.styles.find(s => s.id === selectedStyle)?.priceModifier || 0)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Materiał:</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(product.materials.find(m => m.id === selectedMaterial)?.priceModifier || 0)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Wykończenie:</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(product.finishes.find(f => f.id === selectedFinish)?.priceModifier || 0)}
          </Text>
        </View>
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Razem:</Text>
          <Text style={styles.totalValue}>{formatCurrency(calculateTotalPrice())}</Text>
        </View>
        
        <Button
          onPress={handleCheckout}
          fullWidth
          style={styles.checkoutButton}
        >
          Przejdź do zamówienia
        </Button>
      </Card>
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
  configuratorCard: {
    marginBottom: spacing.lg,
  },
  visualizationContainer: {
    width: '100%',
    height: 256,
    backgroundColor: colors.secondary,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  visualizationText: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  viewButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewButton: {
    marginHorizontal: spacing.xs,
  },
  configurationDetails: {
    padding: spacing.md,
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
  summaryCard: {
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    color: colors.textSecondary,
  },
  summaryValue: {
    color: colors.textPrimary,
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
  checkoutButton: {
    marginTop: spacing.md,
  },
});

export default ConfiguratorScreen;

