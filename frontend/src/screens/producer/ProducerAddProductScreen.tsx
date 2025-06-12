import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFormik } from "formik";
import { productSchema } from "shared/app-model/product.validators";
import { z } from "zod";

// Import reusable UI components
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import Card from "../../components/Card";
import Section from "../../components/Section";
import Loading from "../../components/Loading";
import Checkbox from "../../components/Checkbox";
import { colors, typography, spacing } from "../../styles/designTokens";
import { producerAPI } from "../../services/api";

interface Property {
	id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	additionalPrice: number;
}

type ProductFormData = z.infer<typeof productSchema>;

type ProducerAddProductScreenProps = {
	navigation: any;
};

const ProducerAddProductScreen: React.FC<ProducerAddProductScreenProps> = ({ navigation }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(1); // 1: Basic info, 2: Properties selection, 3: Generate variants

	// Properties data
	const [styles, setStyles] = useState<Property[]>([]);
	const [materials, setMaterials] = useState<Property[]>([]);
	const [finishes, setFinishes] = useState<Property[]>([]);

	// Selected properties
	const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
	const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
	const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);

	// Created product
	const [createdProduct, setCreatedProduct] = useState<any>(null);
	const [generationComplete, setGenerationComplete] = useState(false);

	const categories = [
		{ id: "jacket", name: "Marynarka" },
		{ id: "pants", name: "Spodnie" },
		{ id: "skirt", name: "Spódnica" },
		{ id: "vest", name: "Kamizelka" },
	];

	const formik = useFormik<ProductFormData>({
		initialValues: {
			name: "",
			description: "",
			basePrice: 0,
			category: "",
		},
		validate: (values) => {
			try {
				productSchema.parse(values);
				return {};
			} catch (error) {
				if (error instanceof z.ZodError) {
					const errors: any = {};
					error.errors.forEach((err) => {
						if (err.path.length > 0) {
							errors[err.path[0]] = err.message;
						}
					});
					return errors;
				}
				return {};
			}
		},
		onSubmit: (values) => {
			handleCreateProduct(values);
		},
	});

	useEffect(() => {
		if (step === 2) {
			loadProperties();
		}
	}, [step]);

	const loadProperties = async () => {
		try {
			setIsLoading(true);
			const [stylesRes, materialsRes, finishesRes] = await Promise.all([
				producerAPI.getProperties("styles"),
				producerAPI.getProperties("materials"),
				producerAPI.getProperties("finishes"),
			]);

			setStyles(stylesRes.data.styles || []);
			setMaterials(materialsRes.data.materials || []);
			setFinishes(finishesRes.data.finishes || []);
		} catch (error) {
			console.error("Błąd ładowania właściwości:", error);
			Alert.alert("Błąd", "Nie udało się załadować właściwości");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateProduct = async (values: ProductFormData) => {
		try {
			setIsSubmitting(true);

			const productData = {
				...values,
				basePrice: Number(values.basePrice),
			};

			const response = await producerAPI.createProduct(productData);
			setCreatedProduct(response.product);

			Alert.alert("Sukces", "Produkt został utworzony pomyślnie");
			setStep(2);
		} catch (error) {
			console.error("Błąd tworzenia produktu:", error);
			Alert.alert("Błąd", "Nie udało się utworzyć produktu");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleGenerateVariants = async () => {
		if (!createdProduct) return;

		try {
			setIsSubmitting(true);
			setGenerationComplete(true);
			const variantData = {
				styleIds: selectedStyles,
				materialIds: selectedMaterials,
				finishIds: selectedFinishes,
			};

			await producerAPI.generateVariants(createdProduct.id, variantData);

			Alert.alert("Sukces", "Warianty produktu zostały wygenerowane pomyślnie", [
				{
					text: "OK",
					onPress: () => navigation.navigate("Products"),
				},
			]);
		} catch (error) {
			console.error("Błąd generowania wariantów:", error);
			Alert.alert("Błąd", "Nie udało się wygenerować wariantów");
		} finally {
			setIsSubmitting(false);
		}
	};

	const togglePropertySelection = (propertyId: string, type: "styles" | "materials" | "finishes") => {
		switch (type) {
			case "styles":
				setSelectedStyles((prev) =>
					prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
				);
				break;
			case "materials":
				setSelectedMaterials((prev) =>
					prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
				);
				break;
			case "finishes":
				setSelectedFinishes((prev) =>
					prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
				);
				break;
		}
	};

	const renderPropertySelection = (
		properties: Property[],
		selectedIds: string[],
		type: "styles" | "materials" | "finishes",
		title: string
	) => (
		<Section title={title} style={styles.propertySection}>
			{properties.length === 0 ? (
				<View style={styles.emptyState}>
					<Text style={styles.emptyStateText}>Brak dostępnych {title.toLowerCase()}</Text>
					<Button
						onPress={() => navigation.navigate("ManageProperties")}
						variant="outline"
						size="sm"
						style={styles.addPropertyButton}
					>
						Dodaj {title.toLowerCase()}
					</Button>
				</View>
			) : (
				properties.map((property) => (
					<TouchableOpacity
						key={property.id}
						style={styles.propertyItem}
						onPress={() => togglePropertySelection(property.id, type)}
					>
						<Checkbox
							checked={selectedIds.includes(property.id)}
							onPress={() => togglePropertySelection(property.id, type)}
						/>
						<View style={styles.propertyInfo}>
							<Text style={styles.propertyName}>{property.name}</Text>
							{property.description && <Text style={styles.propertyDescription}>{property.description}</Text>}
							<Text style={styles.propertyPrice}>+{property.additionalPrice} zł</Text>
						</View>
					</TouchableOpacity>
				))
			)}
		</Section>
	);

	if (isLoading) {
		return <Loading fullScreen text="Ładowanie..." />;
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>
					{step === 1 ? "Dodaj nowy produkt" : step === 2 ? "Wybierz właściwości" : "Generuj warianty"}
				</Text>
				<View style={styles.stepIndicator}>
					<Text style={styles.stepText}>Krok {step} z 3</Text>
				</View>
			</View>

			{step === 1 && (
				<Card style={styles.formCard}>
					<FormField
						label="Nazwa produktu *"
						name="name"
						formik={formik}
						placeholder="np. Marynarka damska klasyczna"
					/>

					<FormField
						label="Opis produktu"
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
									onPress={() => formik.setFieldValue("category", cat.id)}
									variant={formik.values.category === cat.id ? "primary" : "outline"}
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

					<Button onPress={formik.handleSubmit} fullWidth loading={isSubmitting} style={styles.submitButton}>
						Dalej
					</Button>
				</Card>
			)}

			{step === 2 && (
				<View>
					<Card style={styles.infoCard}>
						<Text style={styles.infoTitle}>Wybierz właściwości produktu</Text>
						<Text style={styles.infoText}>
							Wybierz style, materiały i wykończenia, które będą dostępne dla tego produktu. Na podstawie wybranych
							opcji zostaną wygenerowane wszystkie możliwe warianty.
						</Text>
					</Card>

					{renderPropertySelection(styles, selectedStyles, "styles", "Style")}
					{renderPropertySelection(materials, selectedMaterials, "materials", "Materiały")}
					{renderPropertySelection(finishes, selectedFinishes, "finishes", "Wykończenia")}

					<View style={styles.navigationButtons}>
						<Button onPress={() => setStep(1)} variant="outline" style={styles.navButton}>
							Wstecz
						</Button>
						<Button
							onPress={() => setStep(3)}
							style={styles.navButton}
							disabled={selectedStyles.length === 0 && selectedMaterials.length === 0 && selectedFinishes.length === 0}
						>
							Dalej
						</Button>
					</View>
				</View>
			)}

			{step === 3 && (
				<View>
					<Card style={styles.summaryCard}>
						<Text style={styles.summaryTitle}>Podsumowanie</Text>
						<Text style={styles.summaryText}>Produkt: {createdProduct?.name}</Text>
						<Text style={styles.summaryText}>Wybrane style: {selectedStyles.length}</Text>
						<Text style={styles.summaryText}>Wybrane materiały: {selectedMaterials.length}</Text>
						<Text style={styles.summaryText}>Wybrane wykończenia: {selectedFinishes.length}</Text>

						<View style={styles.variantCount}>
							<Text style={styles.variantCountText}>
								Zostanie wygenerowanych{" "}
								{Math.max(1, selectedStyles.length || 1) *
									Math.max(1, selectedMaterials.length || 1) *
									Math.max(1, selectedFinishes.length || 1)}{" "}
								wariantów
							</Text>
						</View>
					</Card>

					<View style={styles.navigationButtons}>
						<Button onPress={() => setStep(2)} variant="outline" style={styles.navButton}>
							Wstecz
						</Button>
						<Button onPress={handleGenerateVariants} loading={isSubmitting} style={styles.navButton}>
							Generuj warianty
						</Button>
						{generationComplete && (
							<Text style={styles.successText}>Warianty zostały wygenerowane i zapisane w bazie.</Text>
						)}
					</View>
				</View>
			)}

			{step === 1 && (
				<Section title="Informacje">
					<View style={styles.infoSectionContent}>
						<Text style={styles.infoText}>• Po utworzeniu produktu będziesz mógł wybrać dostępne właściwości</Text>
						<Text style={styles.infoText}>• Cena bazowa to podstawowa cena produktu bez dodatkowych opcji</Text>
						<Text style={styles.infoText}>• Wszystkie pola oznaczone * są wymagane</Text>
					</View>
				</Section>
			)}
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
	stepIndicator: {
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: 12,
	},
	stepText: {
		color: colors.white,
		fontSize: typography.small.fontSize,
		fontWeight: "600",
	},
	formCard: {
		marginBottom: spacing.lg,
	},
	infoCard: {
		marginBottom: spacing.lg,
		backgroundColor: colors.backgroundSecondary,
	},
	infoTitle: {
		fontSize: typography.h4.fontSize,
		fontWeight: typography.h4.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	infoText: {
		color: colors.textSecondary,
		lineHeight: 20,
	},
	categoryLabel: {
		color: colors.textSecondary,
		fontWeight: typography.h4.fontWeight,
		marginBottom: spacing.sm,
	},
	categoryButtonsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
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
	propertySection: {
		marginBottom: spacing.lg,
	},
	propertyItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: spacing.md,
		backgroundColor: colors.white,
		borderRadius: 8,
		marginBottom: spacing.sm,
		borderWidth: 1,
		borderColor: colors.border,
	},
	propertyInfo: {
		flex: 1,
		marginLeft: spacing.md,
	},
	propertyName: {
		fontSize: typography.body.fontSize,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	propertyDescription: {
		fontSize: typography.small.fontSize,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	propertyPrice: {
		fontSize: typography.small.fontSize,
		color: colors.primary,
		fontWeight: "600",
		marginTop: spacing.xs,
	},
	emptyState: {
		alignItems: "center",
		padding: spacing.lg,
	},
	emptyStateText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.md,
	},
	addPropertyButton: {
		marginTop: spacing.sm,
	},
	navigationButtons: {
		flexDirection: "row",
		gap: spacing.md,
		marginTop: spacing.lg,
		marginBottom: spacing.xl,
	},
	navButton: {
		flex: 1,
	},
	summaryCard: {
		marginBottom: spacing.lg,
	},
	summaryTitle: {
		fontSize: typography.h4.fontSize,
		fontWeight: typography.h4.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.md,
	},
	summaryText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.xs,
	},
	variantCount: {
		backgroundColor: colors.backgroundSecondary,
		padding: spacing.md,
		borderRadius: 8,
		marginTop: spacing.md,
	},
	variantCountText: {
		fontSize: typography.body.fontSize,
		fontWeight: "600",
		color: colors.primary,
		textAlign: "center",
	},
	infoSectionContent: {
		padding: spacing.md,
	},
});

export default ProducerAddProductScreen;
