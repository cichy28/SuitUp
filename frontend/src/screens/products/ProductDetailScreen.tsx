import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { colors, typography, spacing } from '../../styles/designTokens';
import { Ionicons } from '@expo/vector-icons';

type ProductDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      productId: string;
    };
  };
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [selectedStyle, setSelectedStyle] = React.useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = React.useState<string | null>(null);
  const [selectedFinish, setSelectedFinish] = React.useState<string | null>(null);
  
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
    
    if (selectedStyle) {
      const style = product.styles.find(s => s.id === selectedStyle);
      if (style) total += style.priceModifier;
    }
    
    if (selectedMaterial) {
      const material = product.materials.find(m => m.id === selectedMaterial);
      if (material) total += material.priceModifier;
    }
    
    if (selectedFinish) {
      const finish = product.finishes.find(f => f.id === selectedFinish);
      if (finish) total += finish.priceModifier;
    }
    
    return total;
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} zł`;
  };

  const handleConfigure = () => {
    navigation.navigate('Configurator', { 
      productId,
      selectedStyle,
      selectedMaterial,
      selectedFinish
    });
  };

  const isConfigurationComplete = () => {
    return selectedStyle && selectedMaterial && selectedFinish;
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie produktu..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Szczegóły produktu</Text>
      </View>

      <Card style={styles.productCard}>
        <View style={styles.productImageContainer}>
          {/* Placeholder for product image */}
          <Ionicons name="shirt-outline" size={64} color={colors.textSecondary} />
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productProducer}>{product.producer}</Text>
          <Text style={styles.productPrice}>{formatCurrency(product.basePrice)}</Text>
        </View>
        
        <View style={styles.productDescriptionContainer}>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
      </Card>

      <Section title="Wybierz styl">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.optionsScroll}
        >
          <View style={styles.optionsContainer}>
            {product.styles.map((style) => (
              <Card 
                key={style.id}
                variant={selectedStyle === style.id ? 'elevated' : 'outlined'}
                style={[styles.optionCard, selectedStyle === style.id && styles.selectedOptionCard]}
                onPress={() => setSelectedStyle(style.id)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionName}>{style.name}</Text>
                  <Text style={styles.optionPriceModifier}>
                    {style.priceModifier > 0 ? `+${formatCurrency(style.priceModifier)}` : 'Bez dopłaty'}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      </Section>

      <Section title="Wybierz materiał">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.optionsScroll}
        >
          <View style={styles.optionsContainer}>
            {product.materials.map((material) => (
              <Card 
                key={material.id}
                variant={selectedMaterial === material.id ? 'elevated' : 'outlined'}
                style={[styles.optionCard, styles.materialOptionCard, selectedMaterial === material.id && styles.selectedOptionCard]}
                onPress={() => setSelectedMaterial(material.id)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionName}>{material.name}</Text>
                  <Text style={styles.optionPriceModifier}>
                    {material.priceModifier > 0 ? `+${formatCurrency(material.priceModifier)}` : 'Bez dopłaty'}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      </Section>

      <Section title="Wybierz wykończenie">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.optionsScroll}
        >
          <View style={styles.optionsContainer}>
            {product.finishes.map((finish) => (
              <Card 
                key={finish.id}
                variant={selectedFinish === finish.id ? 'elevated' : 'outlined'}
                style={[styles.optionCard, styles.finishOptionCard, selectedFinish === finish.id && styles.selectedOptionCard]}
                onPress={() => setSelectedFinish(finish.id)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionName}>{finish.name}</Text>
                  <Text style={styles.optionPriceModifier}>
                    {finish.priceModifier > 0 ? `+${formatCurrency(finish.priceModifier)}` : 'Bez dopłaty'}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      </Section>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cena bazowa:</Text>
          <Text style={styles.summaryValue}>{formatCurrency(product.basePrice)}</Text>
        </View>
        
        {selectedStyle && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Styl:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(product.styles.find(s => s.id === selectedStyle)?.priceModifier || 0)}
            </Text>
          </View>
        )}
        
        {selectedMaterial && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Materiał:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(product.materials.find(m => m.id === selectedMaterial)?.priceModifier || 0)}
            </Text>
          </View>
        )}
        
        {selectedFinish && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Wykończenie:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(product.finishes.find(f => f.id === selectedFinish)?.priceModifier || 0)}
            </Text>
          </View>
        )}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Razem:</Text>
          <Text style={styles.totalValue}>{formatCurrency(calculateTotalPrice())}</Text>
        </View>
        
        <Button
          onPress={handleConfigure}
          fullWidth
          disabled={!isConfigurationComplete()}
          style={styles.configureButton}
        >
          Przejdź do konfiguratora
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
  productCard: {
    marginBottom: spacing.lg,
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.secondary,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  productInfo: {
    marginBottom: spacing.md,
  },
  productName: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  productProducer: {
    color: colors.textSecondary,
  },
  productPrice: {
    color: colors.primary,
    fontWeight: typography.h3.fontWeight,
    marginTop: spacing.xs,
  },
  productDescriptionContainer: {
    marginBottom: spacing.md,
  },
  productDescription: {
    color: colors.textSecondary,
  },
  optionsScroll: {
    paddingVertical: spacing.xs,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionCard: {
    marginRight: spacing.sm,
    width: 120,
  },
  materialOptionCard: {
    width: 160,
  },
  finishOptionCard: {
    width: 140,
  },
  selectedOptionCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  optionContent: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  optionName: {
    fontWeight: typography.h4.fontWeight,
    color: colors.textPrimary,
  },
  optionPriceModifier: {
    fontSize: typography.small.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  configureButton: {
    marginTop: spacing.md,
  },
});

export default ProductDetailScreen;

