import React from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useFormik } from "formik";
import { useAuth } from "../../services/auth";
import { authAPI } from "../../services/api";
import { loginSchema, LoginFormData } from "shared/app-model/auth.validators";
import { createZodValidation } from "shared/app-model/validation";

// Import reusable UI components
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import Card from "../../components/Card";
import Section from "../../components/Section";
import { colors, typography, spacing } from "../../styles/designTokens";

type LoginScreenProps = {
	navigation: any;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
	const { signIn } = useAuth();
	const [loading, setLoading] = React.useState(false);

	const formik = useFormik<LoginFormData>({
		initialValues: {
			email: "",
			password: "",
		},
		validate: createZodValidation(loginSchema),
		onSubmit: async (values) => {
			setLoading(true);
			try {
				await signIn(values.email, values.password);
				// Navigation will be handled by auth context
			} catch (error: any) {
				console.error("Login error:", error);
				Alert.alert("Błąd logowania", error.response?.data?.message || "Wystąpił błąd podczas logowania");
			} finally {
				setLoading(false);
			}
		},
	});

	const handleRegister = () => {
		navigation.navigate("RegisterType");
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Zaloguj się</Text>
				<Text style={styles.headerSubtitle}>Witaj ponownie w Suit Creator</Text>
			</View>

			<Card style={styles.formCard}>
				<FormField
					label="Email"
					name="email"
					formik={formik}
					placeholder="Wprowadź swój email"
					keyboardType="email-address"
					autoCapitalize="none"
				/>

				<FormField label="Hasło" name="password" formik={formik} placeholder="Wprowadź hasło" secureTextEntry />

				<Button onPress={formik.handleSubmit} loading={loading} fullWidth style={styles.loginButton}>
					Zaloguj się
				</Button>
			</Card>

			<Section>
				<View style={styles.registerSection}>
					<Text style={styles.registerText}>Nie masz jeszcze konta?</Text>
					<Button onPress={handleRegister} variant="outline" fullWidth>
						Zarejestruj się
					</Button>
				</View>
			</Section>

			<Section>
				<View style={styles.testAccountsSection}>
					<Text style={styles.testAccountsTitle}>Konta testowe:</Text>
					<Text style={styles.testAccountText}>Klient: klient@example.com / password123</Text>
					<Text style={styles.testAccountText}>Producent: producent@example.com / password123</Text>
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
		alignItems: "center",
		marginBottom: spacing.xl,
		marginTop: spacing.xl,
	},
	headerTitle: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	headerSubtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
	},
	formCard: {
		marginBottom: spacing.lg,
	},
	loginButton: {
		marginTop: spacing.md,
	},
	registerSection: {
		padding: spacing.md,
		alignItems: "center",
	},
	registerText: {
		color: colors.textSecondary,
		marginBottom: spacing.md,
	},
	testAccountsSection: {
		padding: spacing.md,
		alignItems: "center",
	},
	testAccountsTitle: {
		fontSize: typography.h3.fontSize,
		fontWeight: typography.h3.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	testAccountText: {
		fontSize: typography.small.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.xs,
	},
});

export default LoginScreen;
