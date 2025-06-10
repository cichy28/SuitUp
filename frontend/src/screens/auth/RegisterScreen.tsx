import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../services/auth';
import { registerSchema, RegisterFormData } from '../../app-model';
import { createZodValidation } from '../../utils/validation';

// Import reusable UI components
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import Card from '../../components/Card';
import Section from '../../components/Section';
import { colors, typography, spacing } from '../../styles/designTokens';

type RegisterScreenProps = {
  navigation: any;
  route: {
    params: {
      userType: 'client' | 'producer';
    };
  };
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation, route }) => {
  const { userType } = route.params;
  const { register } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: createZodValidation(registerSchema),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await register(values.name, values.email, values.password, userType);
        // Navigation will be handled by auth context
      } catch (error) {
        console.error('Registration error:', error);
        // Handle error (show toast, etc.)
      } finally {
        setLoading(false);
      }
    },
  });

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>SUIT CREATOR</Text>
          <Text style={styles.subtitle}>
            Zarejestruj się jako {userType === 'client' ? 'klient' : 'producent'}
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.userTypeHeader}>
            <Ionicons 
              name={userType === 'client' ? 'person-outline' : 'business-outline'} 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.userTypeText}>
              {userType === 'client' ? 'Konto klienta' : 'Konto producenta'}
            </Text>
          </View>

          <FormField
            label="Imię i nazwisko"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            placeholder="Wprowadź swoje imię i nazwisko"
            error={formik.touched.name && formik.errors.name}
          />

          <FormField
            label="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            placeholder="Wprowadź swój email"
            keyboardType="email-address"
            error={formik.touched.email && formik.errors.email}
          />

          <FormField
            label="Hasło"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            placeholder="Wprowadź hasło"
            secureTextEntry
            error={formik.touched.password && formik.errors.password}
          />

          <FormField
            label="Potwierdź hasło"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            placeholder="Potwierdź hasło"
            secureTextEntry
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <Button
            onPress={formik.handleSubmit}
            fullWidth
            disabled={loading}
            style={styles.registerButton}
          >
            {loading ? 'Rejestracja...' : 'Zarejestruj się'}
          </Button>
        </Card>

        <Section>
          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              Masz już konto?
            </Text>
            <Button
              onPress={handleLogin}
              variant="outline"
              fullWidth
            >
              Zaloguj się
            </Button>
          </View>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Suit Creator. Wszelkie prawa zastrzeżone.
          </Text>
        </View>
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
    padding: spacing.lg,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
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
  formCard: {
    marginBottom: spacing.lg,
  },
  userTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userTypeText: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  loginSection: {
    padding: spacing.md,
    alignItems: 'center',
  },
  loginText: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: typography.small.fontSize,
  },
});

export default RegisterScreen;

