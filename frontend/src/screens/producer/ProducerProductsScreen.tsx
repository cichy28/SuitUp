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

type ProducerProductsScreenProps = {
  navigation: any;
};

const ProducerProductsScreen: React.FC<ProducerProductsScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  
  // Mock data for products
  const products = [
    { 
      id: '1', 
      name: 'Marynarka damska klasyczna',
      category: 'jacket',
      basePrice: 599,
      styles: 3,
      materials: 5,
      finishes: 2
    },
    { 
      id: '2', 
      name: 'Spodnie damskie eleganckie',
      category: 'pants',
      basePrice: 349,
      styles: 2,
      materials: 4,
      finishes: 1
    },
    { 
      id: '3', 
      name: 'Kamizelka damska',
      category: 'vest',
      basePrice: 299,
      styles: 1,
      materials: 3,
      finishes: 2
    },
    { 
      id: '4', 
      name: 'Spódnica ołówkowa',
      category: 'skirt',
      basePrice: 279,
      styles: 2,
      materials: 3,
      finishes: 1
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'jacket':
        return 'shirt-outline';
      case 'pants':
        return 'options-outline';
      case 'vest':
        return 'vest-outline';
      case 'skirt':
        return 'ellipsis-horizontal-outline';
      default:
        return 'cube-outline';
    }
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} zł`;
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie produktów..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Twoje produkty</Text>
        <Button 
          onPress={handleAddProduct}
          size="sm"
          leftIcon="add-outline"
        >
          Dodaj produkt
        </Button>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card 
              variant="outlined" 
              style={styles.productCard}
              onPress={() => handleProductPress(item.id)}
            >
              <View style={styles.productRow}>
                <View style={styles.productIconContainer}>
                  <Ionicons name={getCategoryIcon(item.category)} size={24} color={colors.primary} />
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productBasePrice}>Cena bazowa: {formatCurrency(item.basePrice)}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color={colors.border} />
              </View>
              
              <View style={styles.productStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Style</Text>
                  <Text style={styles.statValue}>{item.styles}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Materiały</Text>
                  <Text style={styles.statValue}>{item.materials}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Wykończenia</Text>
                  <Text style={styles.statValue}>{item.finishes}</Text>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.productListContent}
        />
      ) : (
        <EmptyState
          title="Brak produktów"
          description="Nie masz jeszcze żadnych produktów w swojej ofercie"
          icon={<Ionicons name="cube-outline" size={48} color={colors.textSecondary} />}
          actionLabel="Dodaj pierwszy produkt"
          onAction={handleAddProduct}
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
    marginBottom: spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  productBasePrice: {
    color: colors.textSecondary,
  },
  productStats: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.small.fontSize,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.textPrimary,
  },
  productListContent: {
    paddingBottom: spacing.xl,
  },
});

export default ProducerProductsScreen;

