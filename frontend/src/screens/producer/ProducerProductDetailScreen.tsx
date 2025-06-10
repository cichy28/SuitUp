import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import reusable UI components
import Button from '../../components/Button';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import ListItem from '../../components/ListItem';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { colors, typography, spacing } from '../../styles/designTokens';

type ProducerProductDetailScreenProps = {
  navigation: any;
  route: {
    params: {
      productId: string;
    };
  };
};

const ProducerProductDetailScreen: React.FC<ProducerProductDetailScreenProps> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  
  // Mock product data
  const product = {
    id: productId,
    name: 'Marynarka damska klasyczna',
    description: 'Elegancka marynarka damska w klasycznym kroju, idealna do personalizacji według potrzeb klienta.',
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
    createdAt: '2025-05-15',
    updatedAt: '2025-06-01',
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} zł`;
  };

  const handleEditProduct = () => {
    navigation.navigate('EditProduct', { productId });
  };

  const handleAddStyle = () => {
    navigation.navigate('AddStyle', { productId });
  };

  const handleAddMaterial = () => {
    navigation.navigate('AddMaterial', { productId });
  };

  const handleAddFinish = () => {
    navigation.navigate('AddFinish', { productId });
  };

  const handleDeleteProduct = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDeleteModalVisible(false);
      navigation.navigate('Products');
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Ładowanie..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Szczegóły produktu</Text>
        <Button 
          onPress={handleEditProduct}
          size="sm"
          variant="outline"
          leftIcon="pencil-outline"
        >
          Edytuj
        </Button>
      </View>

      <Card style={styles.productDetailsCard}>
        <View style={styles.productSummary}>
          <View style={styles.productIconContainer}>
            <Ionicons name="shirt-outline" size={24} color={colors.primary} />
          </View>
          
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productIdText}>ID: {product.id}</Text>
          </View>
        </View>
        
        <View style={styles.productDescriptionContainer}>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cena bazowa</Text>
          <Text style={styles.detailValue}>{formatCurrency(product.basePrice)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Kategoria</Text>
          <Badge text="Marynarka" variant="primary" size="sm" />
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data utworzenia</Text>
          <Text style={styles.detailValue}>{product.createdAt}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ostatnia aktualizacja</Text>
          <Text style={styles.detailValue}>{product.updatedAt}</Text>
        </View>
      </Card>

      <Section title="Style">
        {product.styles.length > 0 ? (
          <>
            {product.styles.map((style) => (
              <ListItem
                key={style.id}
                title={style.name}
                subtitle={style.priceModifier > 0 ? `+${formatCurrency(style.priceModifier)}` : 'Bez dopłaty'}
              />
            ))}
            <View style={styles.addButtonContainer}>
              <Button
                onPress={handleAddStyle}
                variant="outline"
                size="sm"
              >
                Dodaj styl
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Brak zdefiniowanych stylów</Text>
            <Button
              onPress={handleAddStyle}
              variant="primary"
              size="sm"
            >
              Dodaj pierwszy styl
            </Button>
          </View>
        )}
      </Section>

      <Section title="Materiały">
        {product.materials.length > 0 ? (
          <>
            {product.materials.map((material) => (
              <ListItem
                key={material.id}
                title={material.name}
                subtitle={material.priceModifier > 0 ? `+${formatCurrency(material.priceModifier)}` : 'Bez dopłaty'}
              />
            ))}
            <View style={styles.addButtonContainer}>
              <Button
                onPress={handleAddMaterial}
                variant="outline"
                size="sm"
              >
                Dodaj materiał
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Brak zdefiniowanych materiałów</Text>
            <Button
              onPress={handleAddMaterial}
              variant="primary"
              size="sm"
            >
              Dodaj pierwszy materiał
            </Button>
          </View>
        )}
      </Section>

      <Section title="Wykończenia">
        {product.finishes.length > 0 ? (
          <>
            {product.finishes.map((finish) => (
              <ListItem
                key={finish.id}
                title={finish.name}
                subtitle={finish.priceModifier > 0 ? `+${formatCurrency(finish.priceModifier)}` : 'Bez dopłaty'}
              />
            ))}
            <View style={styles.addButtonContainer}>
              <Button
                onPress={handleAddFinish}
                variant="outline"
                size="sm"
              >
                Dodaj wykończenie
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Brak zdefiniowanych wykończeń</Text>
            <Button
              onPress={handleAddFinish}
              variant="primary"
              size="sm"
            >
              Dodaj pierwsze wykończenie
            </Button>
          </View>
        )}
      </Section>

      <View style={styles.deleteButtonContainer}>
        <Button
          onPress={handleDeleteProduct}
          variant="danger"
          fullWidth
        >
          Usuń produkt
        </Button>
      </View>

      <Modal
        isVisible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Usuń produkt"
      >
        <View>
          <Text style={styles.modalText}>
            Czy na pewno chcesz usunąć ten produkt? Ta operacja jest nieodwracalna.
          </Text>
          <View style={styles.modalButtons}>
            <Button
              onPress={() => setDeleteModalVisible(false)}
              variant="outline"
              style={styles.modalButton}
            >
              Anuluj
            </Button>
            <Button
              onPress={confirmDelete}
              variant="danger"
              style={styles.modalButton}
            >
              Usuń
            </Button>
          </View>
        </View>
      </Modal>
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
  productSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  productIdText: {
    color: colors.textSecondary,
  },
  productDescriptionContainer: {
    marginBottom: spacing.md,
  },
  productDescription: {
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailLabel: {
    color: colors.textSecondary,
  },
  detailValue: {
    color: colors.textPrimary,
    fontWeight: typography.h4.fontWeight,
  },
  addButtonContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyStateContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  deleteButtonContainer: {
    padding: spacing.md,
  },
  modalText: {
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: spacing.sm,
  },
});

export default ProducerProductDetailScreen;

