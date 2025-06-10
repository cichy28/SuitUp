import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { productSchema, ProductFormData } from '../../app-model';
import { createZodValidation } from '../../utils/validation';

// Import reusable UI components
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import Card from '../../components/Card';
import Section from '../../components/Section';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import { colors, typography, spacing } from '../../styles/designTokens';

type ProducerAddProductScreenProps = {
  navigation: any;
};

const ProducerAddProductScreen: React.FC<ProducerAddProductScreenProps> = ({ navigation }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const categories = [
    { id: 'jacket', name: 'Marynarka' },
    { id: 'pants', name: 'Spodnie' },
    { id: 'skirt', name: 'Spódnica' },
    { id: 'vest', name: 'Kamizelka' },
  ];

  const formik = useFormik<ProductFormData>({
    initialValues: {
      name: '',
      description: '',
      basePrice: 0,
      category: '',
    },
    validate: createZodValidation(productSchema),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Product values:', values);
      
      // Navigate to product detail or products list
      navigation.navigate('Products');
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading fullScreen text="Dodawanie produktu..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dodaj nowy produkt</Text>
      </View>

      <Card style={styles.formCard}>
        <FormField
          label="Nazwa produktu *"
          name="name"
          formik={formik}
          placeholder="np. Marynarka damska klasyczna"
        />

        <FormField
          label="Opis produktu *"
          name="description"
          formik={formik}
          placeholder="Opisz swój produkt..."
          multiline
          numberOfLines={4}
        />

        <FormField
          label="Cena bazowa (zł) *"
          name="basePrice"
          formik={formik}
          placeholder="np. 299.99"
          keyboardType="numeric"
        />

        <Text style={styles.categoryLabel}>Kategoria *</Text>
        <View style={styles.categoryButtonsContainer}>
          {categories.map((cat) => (
            <View key={cat.id} style={styles.categoryButtonWrapper}>
              <Button
                onPress={() => formik.setFieldValue('category', cat.id)}
                variant={formik.values.category === cat.id ? 'primary' : 'outline'}
                size="sm"
              >
                {cat.name}
              </Button>
            </View>
          ))}
        </View>
        {formik.touched.category && formik.errors.category && (
          <Text style={styles.errorMessage}>{formik.errors.category as string}</Text>
        )}

        <Button
          onPress={formik.handleSubmit}
          fullWidth
          loading={isSubmitting}
          style={styles.submitButton}
        >
          Dodaj produkt
        </Button>
      </Card>

      <Section title="Informacje">
        <View style={styles.infoSectionContent}>
          <Text style={styles.infoText}>
            • Po dodaniu produktu będziesz mógł dodać style, materiały i wykończenia
          </Text>
          <Text style={styles.infoText}>
            • Cena bazowa to podstawowa cena produktu bez dodatkowych opcji
          </Text>
          <Text style={styles.infoText}>
            • Wszystkie pola oznaczone * są wymagane
          </Text>
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
  formCard: {
    marginBottom: spacing.lg,
  },
  categoryLabel: {
    color: colors.textSecondary,
    fontWeight: typography.h4.fontWeight,
    marginBottom: spacing.sm,
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  categoryButtonWrapper: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.small.fontSize,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  infoSectionContent: {
    padding: spacing.md,
  },
  infoText: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
});

export default ProducerAddProductScreen;

