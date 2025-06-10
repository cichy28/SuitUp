import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productAPI } from '../../services/api';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import ListItem from '../../components/ListItem';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import { colors, typography, spacing } from '../../styles/designTokens';

type ProductsScreenProps = {
  navigation: any;
};

interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  seller: {
    id: string;
    name: string;
  };
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  const categories = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'jacket', name: 'Marynarki' },
    { id: 'pants', name: 'Spodnie' },
    { id: 'skirt', name: 'Spódnice' },
    { id: 'vest', name: 'Kamizelki' },
  ];

  React.useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const response = await productAPI.getProducts(category || undefined);
      setProducts(response.products || []);
    } catch (error: any) {
      console.error('Error loading products:', error);
      Alert.alert(
        'Błąd',
        'Nie udało się załadować produktów. Sprawdź połączenie z internetem.'
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId === 'all' ? null : categoryId);
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie produktów..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Produkty</Text>

      <Section title="Kategorie">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <Button
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                variant={
                  (selectedCategory === category.id) || 
                  (selectedCategory === null && category.id === 'all') 
                    ? 'primary' 
                    : 'outline'
                }
                size="sm"
                style={styles.categoryButton}
              >
                {category.name}
              </Button>
            ))}
          </View>
        </ScrollView>
      </Section>

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
                  <Text style={styles.productProducer}>{item.seller?.name || 'Nieznany producent'}</Text>
                  <Text style={styles.productPrice}>od {formatCurrency(item.basePrice)}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color={colors.border} />
              </View>
            </Card>
          )}
          contentContainerStyle={styles.productListContent}
          refreshing={loading}
          onRefresh={loadProducts}
        />
      ) : (
        <EmptyState
          title="Brak produktów"
          description={
            selectedCategory 
              ? "Nie znaleziono produktów w tej kategorii" 
              : "Nie znaleziono żadnych produktów"
          }
          icon={<Ionicons name="cube-outline" size={48} color={colors.textSecondary} />}
          actionLabel="Odśwież"
          onAction={loadProducts}
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
  categoriesScroll: {
    marginHorizontal: -spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  categoryButton: {
    marginRight: spacing.sm,
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
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.textPrimary,
  },
  productProducer: {
    color: colors.textSecondary,
    fontSize: typography.small.fontSize,
  },
  productPrice: {
    color: colors.primary,
    fontWeight: typography.h4.fontWeight,
    marginTop: spacing.xs,
  },
  productListContent: {
    paddingBottom: spacing.xl,
  },
});

export default ProductsScreen;

