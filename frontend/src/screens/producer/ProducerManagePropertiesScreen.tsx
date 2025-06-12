import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { propertySchema } from "shared/app-model/product.schema";
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

type PropertyType = "styles" | "materials" | "finishes";

interface Property {
	id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	additionalPrice: number;
}

type PropertyFormData = z.infer<typeof propertySchema>;

type ProducerManagePropertiesScreenProps = {
	navigation: any;
};

const ProducerManagePropertiesScreen: React.FC<ProducerManagePropertiesScreenProps> = ({ navigation }) => {
	const [activeTab, setActiveTab] = useState<PropertyType>("styles");
	const [properties, setProperties] = useState<Property[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);

	const tabs = [
		{ key: "styles" as PropertyType, label: "Style", icon: "shirt-outline" },
		{ key: "materials" as PropertyType, label: "Materiały", icon: "color-palette-outline" },
		{ key: "finishes" as PropertyType, label: "Wykończenia", icon: "diamond-outline" },
	];

	const formik = useFormik<PropertyFormData>({
		initialValues: {
			name: "",
			description: "",
			imageUrl: "",
			additionalPrice: 0,
		},
		validate: (values) => {
			try {
				propertySchema.parse(values);
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
			handleSubmit(values);
		},
	});

	useEffect(() => {
		loadProperties();
	}, [activeTab]);

	const loadProperties = async () => {
		try {
			setIsLoading(true);
			const response = await producerAPI.getProperties(activeTab);
			setProperties(response.data[activeTab] || []);
		} catch (error) {
			console.error("Błąd ładowania właściwości:", error);
			Alert.alert("Błąd", "Nie udało się załadować właściwości");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (values: PropertyFormData) => {
		try {
			setIsSubmitting(true);

			const propertyData = {
				...values,
				imageUrl: values.imageUrl || undefined,
			};

			await producerAPI.addProperty(activeTab, propertyData);

			Alert.alert("Sukces", `${getPropertyTypeName(activeTab)} została dodana pomyślnie`);
			setShowAddModal(false);
			formik.resetForm();
			loadProperties();
		} catch (error) {
			console.error("Błąd dodawania właściwości:", error);
			Alert.alert("Błąd", "Nie udało się dodać właściwości");
		} finally {
			setIsSubmitting(false);
		}
	};

	const getPropertyTypeName = (type: PropertyType) => {
		switch (type) {
			case "styles":
				return "Styl";
			case "materials":
				return "Materiał";
			case "finishes":
				return "Wykończenie";
		}
	};

	const getPropertyTypeNamePlural = (type: PropertyType) => {
		switch (type) {
			case "styles":
				return "Style";
			case "materials":
				return "Materiały";
			case "finishes":
				return "Wykończenia";
		}
	};

	const renderProperty = (property: Property) => (
		<Card key={property.id} style={styles.propertyCard}>
			<View style={styles.propertyHeader}>
				<View style={styles.propertyInfo}>
					<Text style={styles.propertyName}>{property.name}</Text>
					{property.description && <Text style={styles.propertyDescription}>{property.description}</Text>}
					<Text style={styles.propertyPrice}>Dodatkowa cena: {property.additionalPrice} zł</Text>
				</View>
				{property.imageUrl && <Image source={{ uri: property.imageUrl }} style={styles.propertyImage} />}
			</View>
		</Card>
	);

	if (isLoading) {
		return <Loading fullScreen text="Ładowanie właściwości..." />;
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Zarządzanie właściwościami</Text>
				<Button onPress={() => setShowAddModal(true)} size="sm" style={styles.addButton}>
					<Ionicons name="add" size={16} color={colors.white} />
					Dodaj
				</Button>
			</View>

			{/* Tabs */}
			<View style={styles.tabsContainer}>
				{tabs.map((tab) => (
					<TouchableOpacity
						key={tab.key}
						style={[styles.tab, activeTab === tab.key && styles.activeTab]}
						onPress={() => setActiveTab(tab.key)}
					>
						<Ionicons
							name={tab.icon as any}
							size={20}
							color={activeTab === tab.key ? colors.primary : colors.textSecondary}
						/>
						<Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Properties List */}
			<ScrollView style={styles.content}>
				<Section title={getPropertyTypeNamePlural(activeTab)}>
					{properties.length === 0 ? (
						<View style={styles.emptyState}>
							<Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
							<Text style={styles.emptyStateText}>Brak {getPropertyTypeNamePlural(activeTab).toLowerCase()}</Text>
							<Text style={styles.emptyStateSubtext}>Dodaj pierwszą właściwość, aby rozpocząć</Text>
						</View>
					) : (
						properties.map(renderProperty)
					)}
				</Section>
			</ScrollView>

			{/* Add Property Modal */}
			<Modal
				visible={showAddModal}
				onClose={() => {
					setShowAddModal(false);
					formik.resetForm();
				}}
				title={`Dodaj ${getPropertyTypeName(activeTab)}`}
			>
				<ScrollView style={styles.modalContent}>
					<FormField
						label="Nazwa *"
						name="name"
						formik={formik}
						placeholder={`np. ${activeTab === "styles" ? "Slim fit" : activeTab === "materials" ? "Wełna merino" : "Premium"}`}
					/>

					<FormField
						label="Opis"
						name="description"
						formik={formik}
						placeholder="Opisz właściwość..."
						multiline
						numberOfLines={3}
					/>

					<FormField
						label="URL obrazka"
						name="imageUrl"
						formik={formik}
						placeholder="https://example.com/image.jpg"
						autoCapitalize="none"
					/>

					<FormField
						label="Dodatkowa cena (zł)"
						name="additionalPrice"
						formik={formik}
						placeholder="0"
						keyboardType="numeric"
					/>

					<View style={styles.modalButtons}>
						<Button
							onPress={() => {
								setShowAddModal(false);
								formik.resetForm();
							}}
							variant="outline"
							style={styles.modalButton}
						>
							Anuluj
						</Button>
						<Button onPress={formik.handleSubmit} loading={isSubmitting} style={styles.modalButton}>
							Dodaj
						</Button>
					</View>
				</ScrollView>
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
	headerTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	addButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	tabsContainer: {
		flexDirection: "row",
		backgroundColor: colors.white,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	tab: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.md,
		gap: spacing.xs,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: colors.primary,
	},
	tabText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	activeTabText: {
		color: colors.primary,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		padding: spacing.md,
	},
	propertyCard: {
		marginBottom: spacing.md,
	},
	propertyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	propertyInfo: {
		flex: 1,
		marginRight: spacing.md,
	},
	propertyName: {
		fontSize: typography.h4.fontSize,
		fontWeight: typography.h4.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	propertyDescription: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.xs,
	},
	propertyPrice: {
		fontSize: typography.small.fontSize,
		color: colors.primary,
		fontWeight: "600",
	},
	propertyImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
		backgroundColor: colors.backgroundSecondary,
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
	modalContent: {
		maxHeight: 400,
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

export default ProducerManagePropertiesScreen;
