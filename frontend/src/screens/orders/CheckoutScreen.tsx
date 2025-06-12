import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFormik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { checkoutSchema, CheckoutFormData } from "shared/app-model/order.validators";
import { createZodValidation } from "shared/app-model/validation";

// Import reusable UI components
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import Card from "../../components/Card";
import Section from "../../components/Section";
import Loading from "../../components/Loading";
import { colors, typography, spacing } from "../../styles/designTokens";

type CheckoutScreenProps = {
	navigation: any;
	route: {
		params: {
			productId: string;
			selectedStyle: string;
			selectedMaterial: string;
			selectedFinish: string;
			totalPrice: number;
		};
	};
};

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation, route }) => {
	const { productId, selectedStyle, selectedMaterial, selectedFinish, totalPrice } = route.params;
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	// Mock product data
	const product = {
		id: productId,
		name: "Marynarka damska klasyczna",
		producer: "Eleganza Fashion",
	};

	const formik = useFormik<CheckoutFormData>({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			postalCode: "",
			notes: "",
		},
		validate: createZodValidation(checkoutSchema),
		onSubmit: (values) => {
			handleSubmit(values);
		},
	});

	const handleSubmit = async (values: any) => {
		try {
			setIsSubmitting(true);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			console.log("Order values:", {
				...values,
				productId,
				selectedStyle,
				selectedMaterial,
				selectedFinish,
				totalPrice,
			});

			// Navigate to order confirmation
			navigation.navigate("OrderConfirmation", { orderId: "ORD-" + Math.floor(Math.random() * 10000) });
		} catch (error) {
			console.error("Error placing order:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatCurrency = (value: number) => {
		return `${value.toLocaleString()} zł`;
	};

	if (isSubmitting) {
		return <Loading fullScreen text="Składanie zamówienia..." />;
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Zamówienie</Text>
			</View>

			<Card style={styles.summaryCard}>
				<View style={styles.summaryContent}>
					<Text style={styles.summaryTitle}>Podsumowanie zamówienia</Text>

					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Produkt:</Text>
						<Text style={styles.summaryValue}>{product.name}</Text>
					</View>

					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Producent:</Text>
						<Text style={styles.summaryValue}>{product.producer}</Text>
					</View>

					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Razem:</Text>
						<Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
					</View>
				</View>
			</Card>

			<Section title="Dane do zamówienia">
				<View style={styles.formSectionContent}>
					<FormField label="Imię *" name="firstName" formik={formik} placeholder="Wprowadź imię" />

					<FormField label="Nazwisko *" name="lastName" formik={formik} placeholder="Wprowadź nazwisko" />

					<FormField
						label="Email *"
						name="email"
						formik={formik}
						placeholder="Wprowadź email"
						keyboardType="email-address"
					/>

					<FormField
						label="Telefon *"
						name="phone"
						formik={formik}
						placeholder="Wprowadź numer telefonu"
						keyboardType="phone-pad"
					/>

					<FormField label="Adres *" name="address" formik={formik} placeholder="Wprowadź adres" />

					<FormField label="Miasto *" name="city" formik={formik} placeholder="Wprowadź miasto" />

					<FormField label="Kod pocztowy *" name="postalCode" formik={formik} placeholder="XX-XXX" />

					<FormField
						label="Uwagi do zamówienia"
						name="notes"
						formik={formik}
						placeholder="Opcjonalne uwagi do zamówienia"
						multiline
						numberOfLines={3}
					/>
				</View>
			</Section>

			<Section>
				<View style={styles.termsAndConditions}>
					<Text style={styles.termsText}>
						Klikając "Złóż zamówienie" akceptujesz regulamin sklepu oraz politykę prywatności.
					</Text>
					<Button onPress={formik.handleSubmit} fullWidth>
						Złóż zamówienie
					</Button>
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
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.lg,
	},
	headerTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	summaryCard: {
		marginBottom: spacing.lg,
	},
	summaryContent: {
		padding: spacing.md,
	},
	summaryTitle: {
		fontSize: typography.h3.fontSize,
		fontWeight: typography.h3.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.md,
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: spacing.xs,
	},
	summaryLabel: {
		color: colors.textSecondary,
	},
	summaryValue: {
		color: colors.textPrimary,
		fontWeight: typography.h4.fontWeight,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
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
	formSectionContent: {
		padding: spacing.md,
	},
	termsAndConditions: {
		padding: spacing.md,
	},
	termsText: {
		color: colors.textSecondary,
		marginBottom: spacing.md,
	},
});

export default CheckoutScreen;
