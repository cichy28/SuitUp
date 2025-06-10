import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../services/auth';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import ListItem from '../../components/ListItem';
import EmptyState from '../../components/EmptyState';
import Loading from '../../components/Loading';
import { colors, typography, spacing } from '../../styles/designTokens';

type HomeScreenProps = {
  navigation: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [featuredProducts, setFeaturedProducts] = React.useState([]);

  React.useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    try {
      // Mock data for featured products
      const products = [
        { 
          id: '1', 
          name: 'Marynarka damska klasyczna', 
          producer: 'Eleganza Fashion',
          basePrice: 599,
          image: null
        },
        { 
          id: '2', 
          name: 'Spodnie damskie eleganckie', 
          producer: 'Eleganza Fashion',
          basePrice: 349,
          image: null
        },
        { 
          id: '3', 
          name: 'Kamizelka damska', 
          producer: 'ModernSuit',
          basePrice: 299,
          image: null
        }
      ];
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} zł`;
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleViewAllProducts = () => {
    navigation.navigate('Products');
  };

  const handleMeasurements = () => {
    navigation.navigate('Measurements');
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SUIT CREATOR</Text>
          <Text style={styles.subtitle}>
            Witaj, {user?.name}! Twoje spersonalizowane ubrania na wyciągnięcie ręki
          </Text>
        </View>

        <Card style={styles.measurementsCard}>
          <View style={styles.measurementsContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="body-outline" size={30} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Twoje wymiary</Text>
            <Text style={styles.cardDescription}>
              Wprowadź swoje wymiary, aby otrzymać idealne dopasowanie
            </Text>
            <Button
              onPress={handleMeasurements}
              variant="primary"
            >
              Wprowadź wymiary
            </Button>
          </View>
        </Card>

        <Section title="Polecane produkty">
          {featuredProducts.map((product) => (
            <Card 
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product.id)}
            >
              <View style={styles.productRow}>
                <View style={styles.productImage}>
                  <Ionicons name="shirt-outline" size={30} color={colors.textSecondary} />
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productProducer}>{product.producer}</Text>
                  <Text style={styles.productPrice}>{formatCurrency(product.basePrice)}</Text>
                </View>
                
                <Ionicons name="chevron-forward" size={20} color={colors.border} />
              </View>
            </Card>
          ))}
          
          <View style={styles.viewAllContainer}>
            <Button
              onPress={handleViewAllProducts}
              variant="outline"
              fullWidth
            >
              Zobacz wszystkie produkty
            </Button>
          </View>
        </Section>

        <Section title="Jak to działa?" style={styles.howItWorksSection}>
          <View style={styles.howItWorksContent}>
            <ListItem
              leftIcon="body-outline"
              title="Wprowadź wymiary"
              subtitle="Podaj swoje wymiary ciała dla idealnego dopasowania"
            />
            <ListItem
              leftIcon="shirt-outline"
              title="Wybierz produkt"
              subtitle="Przeglądaj oferty od różnych producentów"
            />
            <ListItem
              leftIcon="color-palette-outline"
              title="Personalizuj"
              subtitle="Wybierz styl, materiał i wykończenia"
            />
            <ListItem
              leftIcon="checkmark-circle-outline"
              title="Zamów"
              subtitle="Złóż zamówienie i czekaj na realizację"
            />
          </View>
        </Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  measurementsCard: {
    marginBottom: spacing.lg,
  },
  measurementsContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textPrimary,
  },
  cardDescription: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  productCard: {
    marginBottom: spacing.md,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.secondary,
    borderRadius: spacing.sm,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
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
  viewAllContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  howItWorksSection: {
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  howItWorksContent: {
    padding: spacing.md,
  },
});

export default HomeScreen;

