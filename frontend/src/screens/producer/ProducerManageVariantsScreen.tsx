import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { imageSchema } from "shared/app-model/product.schema";
import { z } from "zod";

// Import reusable UI components
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import Card from "../../components/Card";
import Section from "../../components/Section";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import { colors, typography, spacing } from "../../styles/designTokens";
import { producerAPI } from "../../services/api";

interface ProductVariant {
	id: string;
	productId: string;
	styleId?: string;
	materialId?: string;
	finishId?: string;
	sku?: string;
	price: number;
	isActive: boolean;
	style?: {
		id: string;
		name: string;
		description?: string;
		imageUrl?: string;
		additionalPrice: number;
	};
	material?: {
		id: string;
		name: string;
		description?: string;
		imageUrl?: string;
		additionalPrice: number;
	};
	finish?: {
		id: string;
		name: string;
		description?: string;
		imageUrl?: string;
		additionalPrice: number;
	};
	images: {
		id: string;
		imageUrl: string;
		viewType: "front" | "left" | "right";
	}[];
}

interface Product {
	id: string;
	name: string;
	description?: string;
	basePrice: number;
	category: string;
	variants: ProductVariant[];
}

type ImageFormData = z.infer<typeof imageSchema>;

type ProducerManageVariantsScreenProps = {
	navigation: any;
	route: {
		params: {
			productId: string;
		};
	};
};

const ProducerManageVariantsScreen: React.FC<ProducerManageVariantsScreenProps> = ({ navigation, route }) => {
	const { productId } = route.params;

	const [product, setProduct] = useState<Product | null>(null);
	const [variants, setVariants] = useState<ProductVariant[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
	const [selectedViewType, setSelectedViewType] = useState<"front" | "left" | "right">("front");

	const viewTypes = [
		{ key: "front" as const, label: "Przód", icon: "person-outline" },
		{ key: "left" as const, label: "Lewy bok", icon: "arrow-back-outline" },
		{ key: "right" as const, label: "Prawy bok", icon: "arrow-forward-outline" },
	];

	const formik = useFormik<ImageFormData>({
		initialValues: {
			imageUrl: "",
		},
		validate: (values) => {
			try {
				imageSchema.parse(values);
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
			handleUpdateImage(values);
		},
	});

	useEffect(() => {
		loadProductAndVariants();
	}, [productId]);

	const loadProductAndVariants = async () => {
		try {
			setIsLoading(true);
			const [productRes, variantsRes] = await Promise.all([
				producerAPI.getProducerProductDetails(productId),
				producerAPI.getVariants(productId),
			]);

			setProduct(productRes.product);
			setVariants(variantsRes.variants || []);
		} catch (error) {
			console.error("Błąd ładowania danych:", error);
			Alert.alert("Błąd", "Nie udało się załadować danych produktu");
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateImage = async (values: ImageFormData) => {
		if (!selectedVariant) return;

		try {
			setIsSubmitting(true);

			await producerAPI.updateVariantImage(selectedVariant.id, selectedViewType, values.imageUrl);

			Alert.alert("Sukces", "Obrazek został zaktualizowany pomyślnie");
			setShowImageModal(false);
			formik.resetForm();
			loadProductAndVariants();
		} catch (error) {
			console.error("Błąd aktualizacji obrazka:", error);
			Alert.alert("Błąd", "Nie udało się zaktualizować obrazka");
		} finally {
			setIsSubmitting(false);
		}
	};

	const openImageModal = (variant: ProductVariant, viewType: "front" | "left" | "right") => {
		setSelectedVariant(variant);
		setSelectedViewType(viewType);

		// Znajdź istniejący obrazek dla tego widoku
		const existingImage = variant.images.find((img) => img.viewType === viewType);
		formik.setFieldValue("imageUrl", existingImage?.imageUrl || "");

		setShowImageModal(true);
	};

	const getVariantDisplayName = (variant: ProductVariant) => {
		const parts = [];
		if (variant.style) parts.push(variant.style.name);
		if (variant.material) parts.push(variant.material.name);
		if (variant.finish) parts.push(variant.finish.name);

		return parts.length > 0 ? parts.join(" + ") : "Wariant podstawowy";
	};

	const getImageForViewType = (variant: ProductVariant, viewType: "front" | "left" | "right") => {
		return variant.images.find((img) => img.viewType === viewType);
	};

	const renderVariantCard = (variant: ProductVariant) => (
		<Card key={variant.id} style={styles.variantCard}>
			<View style={styles.variantHeader}>
				<View style={styles.variantInfo}>
					<Text style={styles.variantName}>{getVariantDisplayName(variant)}</Text>
					<Text style={styles.variantPrice}>{variant.price} zł</Text>
					{variant.sku && <Text style={styles.variantSku}>SKU: {variant.sku}</Text>}
				</View>
				<View style={[styles.statusBadge, { backgroundColor: variant.isActive ? colors.success : colors.warning }]}>
					<Text style={styles.statusText}>{variant.isActive ? "Aktywny" : "Nieaktywny"}</Text>
				</View>
			</View>

			<View style={styles.imagesSection}>
				<Text style={styles.imagesSectionTitle}>Obrazki wariantu</Text>
				<View style={styles.imagesGrid}>
					{viewTypes.map((viewType) => {
						const image = getImageForViewType(variant, viewType.key);
						return (
							<TouchableOpacity
								key={viewType.key}
								style={styles.imageSlot}
								onPress={() => openImageModal(variant, viewType.key)}
							>
								{image ? (
									<Image source={{ uri: image.imageUrl }} style={styles.variantImage} />
								) : (
									<View style={styles.emptyImageSlot}>
										<Ionicons name={viewType.icon as any} size={24} color={colors.textSecondary} />
									</View>
								)}
								<Text style={styles.imageSlotLabel}>{viewType.label}</Text>
								<View style={styles.editOverlay}>
									<Ionicons name="camera-outline" size={16} color={colors.white} />
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>

			{/* Szczegóły wariantu */}
			<View style={styles.variantDetails}>
				{variant.style && (
					<View style={styles.propertyDetail}>
						<Text style={styles.propertyLabel}>Styl:</Text>
						<Text style={styles.propertyValue}>{variant.style.name}</Text>
						{variant.style.additionalPrice > 0 && (
							<Text style={styles.propertyPrice}>+{variant.style.additionalPrice} zł</Text>
						)}
					</View>
				)}

				{variant.material && (
					<View style={styles.propertyDetail}>
						<Text style={styles.propertyLabel}>Materiał:</Text>
						<Text style={styles.propertyValue}>{variant.material.name}</Text>
						{variant.material.additionalPrice > 0 && (
							<Text style={styles.propertyPrice}>+{variant.material.additionalPrice} zł</Text>
						)}
					</View>
				)}

				{variant.finish && (
					<View style={styles.propertyDetail}>
						<Text style={styles.propertyLabel}>Wykończenie:</Text>
						<Text style={styles.propertyValue}>{variant.finish.name}</Text>
						{variant.finish.additionalPrice > 0 && (
							<Text style={styles.propertyPrice}>+{variant.finish.additionalPrice} zł</Text>
						)}
					</View>
				)}
			</View>
		</Card>
	);

	if (isLoading) {
		return <Loading fullScreen text="Ładowanie wariantów..." />;
	}

	if (!product) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Nie udało się załadować produktu</Text>
				<Button onPress={() => navigation.goBack()}>Wróć</Button>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerInfo}>
					<Text style={styles.headerTitle}>Warianty produktu</Text>
					<Text style={styles.headerSubtitle}>{product.name}</Text>
				</View>
				<Button onPress={() => navigation.navigate("AddProduct")} size="sm" variant="outline">
					<Ionicons name="add" size={16} color={colors.primary} />
					Nowy produkt
				</Button>
			</View>

			<ScrollView style={styles.content}>
				<Section title={`Warianty (${variants.length})`}>
					{variants.length === 0 ? (
						<View style={styles.emptyState}>
							<Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
							<Text style={styles.emptyStateText}>Brak wariantów produktu</Text>
							<Text style={styles.emptyStateSubtext}>Wygeneruj warianty podczas dodawania produktu</Text>
							<Button onPress={() => navigation.navigate("AddProduct")} style={styles.emptyStateButton}>
								Dodaj nowy produkt
							</Button>
						</View>
					) : (
						variants.map(renderVariantCard)
					)}
				</Section>

				<Section title="Informacje">
					<View style={styles.infoContent}>
						<Text style={styles.infoText}>• Każdy wariant może mieć 3 obrazki: przód, lewy bok i prawy bok</Text>
						<Text style={styles.infoText}>• Obrazki pomagają klientom lepiej zobaczyć produkt</Text>
						<Text style={styles.infoText}>• Kliknij na miejsce obrazka, aby go dodać lub zmienić</Text>
					</View>
				</Section>
			</ScrollView>

			{/* Modal do edycji obrazka */}
			<Modal
				visible={showImageModal}
				onClose={() => {
					setShowImageModal(false);
					formik.resetForm();
				}}
				title={`Obrazek - ${viewTypes.find((vt) => vt.key === selectedViewType)?.label}`}
			>
				<View style={styles.modalContent}>
					<Text style={styles.modalSubtitle}>
						Wariant: {selectedVariant ? getVariantDisplayName(selectedVariant) : ""}
					</Text>

					<FormField
						label="URL obrazka *"
						name="imageUrl"
						formik={formik}
						placeholder="https://example.com/image.jpg"
						autoCapitalize="none"
					/>

					<View style={styles.modalButtons}>
						<Button
							onPress={() => {
								setShowImageModal(false);
								formik.resetForm();
							}}
							variant="outline"
							style={styles.modalButton}
						>
							Anuluj
						</Button>
						<Button onPress={formik.handleSubmit} loading={isSubmitting} style={styles.modalButton}>
							Zapisz
						</Button>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: spacing.md,
		backgroundColor: colors.white,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	headerInfo: {
		flex: 1,
	},
	headerTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	headerSubtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginTop: spacing.xs,
	},
	content: {
		flex: 1,
		padding: spacing.md,
	},
	variantCard: {
		marginBottom: spacing.lg,
	},
	variantHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: spacing.md,
	},
	variantInfo: {
		flex: 1,
	},
	variantName: {
		fontSize: typography.h4.fontSize,
		fontWeight: typography.h4.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	variantPrice: {
		fontSize: typography.h4.fontSize,
		color: colors.primary,
		fontWeight: "600",
		marginBottom: spacing.xs,
	},
	variantSku: {
		fontSize: typography.small.fontSize,
		color: colors.textSecondary,
	},
	statusBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: 12,
	},
	statusText: {
		color: colors.white,
		fontSize: typography.small.fontSize,
		fontWeight: "600",
	},
	imagesSection: {
		marginBottom: spacing.md,
	},
	imagesSectionTitle: {
		fontSize: typography.h4.fontSize,
		fontWeight: typography.h4.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	imagesGrid: {
		flexDirection: "row",
		gap: spacing.md,
	},
	imageSlot: {
		flex: 1,
		alignItems: "center",
		position: "relative",
	},
	variantImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: colors.backgroundSecondary,
	},
	emptyImageSlot: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: colors.backgroundSecondary,
		borderWidth: 2,
		borderColor: colors.border,
		borderStyle: "dashed",
		alignItems: "center",
		justifyContent: "center",
	},
	imageSlotLabel: {
		fontSize: typography.small.fontSize,
		color: colors.textSecondary,
		marginTop: spacing.xs,
		textAlign: "center",
	},
	editOverlay: {
		position: "absolute",
		top: 4,
		right: 4,
		backgroundColor: colors.primary,
		borderRadius: 12,
		width: 24,
		height: 24,
		alignItems: "center",
		justifyContent: "center",
	},
	variantDetails: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingTop: spacing.md,
	},
	propertyDetail: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	propertyLabel: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		width: 80,
	},
	propertyValue: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
		flex: 1,
	},
	propertyPrice: {
		fontSize: typography.small.fontSize,
		color: colors.primary,
		fontWeight: "600",
	},
	emptyState: {
		alignItems: "center",
		padding: spacing.xl,
	},
	emptyStateText: {
		fontSize: typography.h4.fontSize,
		fontWeight: typography.h4.fontWeight,
		color: colors.textSecondary,
		marginTop: spacing.md,
	},
	emptyStateSubtext: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginTop: spacing.xs,
		textAlign: "center",
	},
	emptyStateButton: {
		marginTop: spacing.lg,
	},
	infoContent: {
		padding: spacing.md,
	},
	infoText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.xs,
	},
	errorContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: spacing.lg,
	},
	errorText: {
		fontSize: typography.h4.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.lg,
		textAlign: "center",
	},
	modalContent: {
		maxHeight: 300,
	},
	modalSubtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.md,
	},
	modalButtons: {
		flexDirection: "row",
		gap: spacing.md,
		marginTop: spacing.lg,
	},
	modalButton: {
		flex: 1,
	},
});

export default ProducerManageVariantsScreen;
