// In: frontend/src/screens/ProductConfiguratorView.tsx

import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator, Modal } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import { RootStackParamList } from "../navigation/AppNavigator";
import { useGetProductById } from "../hooks/useApi";
import { InteractiveImageView } from "../components/InteractiveImageView";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import VariantSelector from "../components/VariantSelector";
import { Hotspot, PropertyVariant } from "shared/validators/product";

type ConfiguratorRouteProp = RouteProp<RootStackParamList, "Configurator">;

// --- POPRAWKA TUTAJ ---
// Zmieniamy na export domyślny, aby pasował do AppNavigator.tsx
export default function ProductConfiguratorView() {
	// --------------------
	const route = useRoute<ConfiguratorRouteProp>();
	const { productId } = route.params;

	const { data: product, loading, error } = useGetProductById(productId);

	const [selectedVariants, setSelectedVariants] = useState<Record<string, PropertyVariant>>({});
	const [isModalVisible, setModalVisible] = useState(false);
	const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

	const currentPrice = useMemo(() => {
		if (!product) return 0;
		const basePrice = Number(product.basePrice);
		const additionalCost = Object.values(selectedVariants).reduce(
			(sum, variant) => sum + Number(variant.additionalCost),
			0
		);
		return basePrice + additionalCost;
	}, [product, selectedVariants]);

	const allOptionsSelected = useMemo(() => {
		if (!product || !product.hotspots) return false;
		return product.hotspots.length === Object.keys(selectedVariants).length;
	}, [product, selectedVariants]);

	const handleHotspotPress = (hotspot: Hotspot) => {
		setActiveHotspot(hotspot);
		setModalVisible(true);
	};

	const handleVariantSelect = (variant: PropertyVariant) => {
		if (activeHotspot) {
			setSelectedVariants((prev) => ({
				...prev,
				[activeHotspot.propertyId]: variant,
			}));
		}
		setModalVisible(false);
		setActiveHotspot(null);
	};

	if (loading) {
		return (
			<View style={styles.centeredContainer}>
				<ActivityIndicator size="large" />
				<Text>Ładowanie produktu...</Text>
			</View>
		);
	}

	if (error || !product) {
		return (
			<View style={styles.centeredContainer}>
				<Text>Nie udało się załadować produktu. Spróbuj ponownie.</Text>
			</View>
		);
	}

	return (
		<ThemedView style={styles.container}>
			{product.mainImage && (
				<InteractiveImageView
					imageUrl={product.mainImage.url}
					hotspots={product.hotspots}
					onHotspotPress={handleHotspotPress}
				/>
			)}

			<View style={styles.detailsContainer}>
				<ThemedText style={styles.productName}>{product.name}</ThemedText>
				<ThemedText style={styles.price}>{currentPrice.toFixed(2)} zł</ThemedText>
				<ThemedText style={styles.description}>Wybierz opcje dla każdego z punktów na obrazku.</ThemedText>

				<View style={styles.summaryBox}>
					{product.hotspots.map((hotspot) => {
						const selected = selectedVariants[hotspot.propertyId];
						return (
							<View key={hotspot.id} style={styles.summaryItem}>
								<Text style={styles.summaryProperty}>{hotspot.property?.name || "Cecha"}:</Text>
								<Text style={selected ? styles.summarySelected : styles.summaryNotSelected}>
									{selected ? selected.name : "Nie wybrano"}
								</Text>
							</View>
						);
					})}
				</View>

				<Button
					title="Dalej"
					onPress={() => console.log("Przejście do podsumowania", { productId, selectedVariants })}
					disabled={!allOptionsSelected}
				/>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{activeHotspot && activeHotspot.property && (
							<VariantSelector
								property={activeHotspot.property}
								onSelectVariant={handleVariantSelect}
								onClose={() => setModalVisible(false)}
							/>
						)}
					</View>
				</View>
			</Modal>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	centeredContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	detailsContainer: {
		padding: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: "#F7F5F3",
		marginTop: -20,
	},
	productName: {
		fontSize: 24,
		fontWeight: "bold",
	},
	price: {
		fontSize: 20,
		color: "#888",
		marginVertical: 8,
	},
	description: {
		fontSize: 14,
		color: "#555",
		marginBottom: 16,
	},
	summaryBox: {
		marginBottom: 20,
		padding: 15,
		backgroundColor: "#FFF",
		borderRadius: 10,
	},
	summaryItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	summaryProperty: {
		fontWeight: "bold",
		color: "#333",
	},
	summarySelected: {
		color: "green",
	},
	summaryNotSelected: {
		color: "red",
		fontStyle: "italic",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});
