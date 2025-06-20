import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Importy komponentów, hooków i typów
import ProductConfiguratorView from "../components/ProductConfiguratorView";
import VariantSelector from "../components/VariantSelector";
import StyledButton from "../components/StyledButton";
import { useDesign } from "../context/DesignContext";
import { useGetProductDetails } from "../hooks/useApi";
import { RootStackParamList } from "../navigation/AppNavigator"; // Załóżmy, że ten typ istnieje
import { Property } from "../../../shared/validators/property"; // Upewnij się, że ten typ jest poprawnie zdefiniowany

// Typy dla nawigacji i parametrów trasy
type ConfiguratorScreenRouteProp = RouteProp<RootStackParamList, "Configurator">;
type ConfiguratorScreenNavigationProp = StackNavigationProp<RootStackParamList, "Configurator">;

const ConfiguratorScreen = () => {
	const navigation = useNavigation<ConfiguratorScreenNavigationProp>();
	const route = useRoute<ConfiguratorScreenRouteProp>();
	const { productId } = route.params; // Pobieranie ID produktu z nawigacji

	const { state: designState, dispatch } = useDesign();
	const { data: product, loading, error } = useGetProductDetails(productId);

	const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

	// Efekt do ustawienia początkowej aktywnej właściwości
	useEffect(() => {
		if (product && product.properties && product.properties.length > 0) {
			// Sprawdzamy, czy pierwsza właściwość ma hotspot, jeśli tak, ustawiamy ją jako aktywną
			const firstPropertyWithHotspot = product.properties.find((p) => p.hotspotX !== null && p.hotspotY !== null);
			if (firstPropertyWithHotspot) {
				setActivePropertyId(firstPropertyWithHotspot.property.id);
			} else if (product.properties[0]) {
				// Jeśli żadna nie ma hotspotu, ustawiamy po prostu pierwszą z listy
				setActivePropertyId(product.properties[0].property.id);
			}
		}
	}, [product]);

	// Handler do wyboru wariantu
	const handleVariantSelect = (variantId: string) => {
		if (activePropertyId) {
			dispatch({
				type: "SELECT_VARIANT",
				payload: { propertyId: activePropertyId, variantId },
			});
		}
	};

	// Handler do zakończenia konfiguracji
	const handleFinish = () => {
		// Przejdź do ekranu podsumowania (lub pomiarów, w zależności od przepływu)
		navigation.navigate("Summary");
	};

	// --- Renderowanie stanów ładowania i błędu ---
	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#C88F54" />
			</View>
		);
	}

	if (error || !product) {
		return (
			<View style={styles.centered}>
				<Text style={styles.errorText}>Nie udało się załadować produktu.</Text>
				<StyledButton
					title="Spróbuj ponownie"
					onPress={() => {
						/* logika odświeżania */
					}}
				/>
			</View>
		);
	}

	// --- Przetwarzanie danych dla komponentów potomnych ---

	// 1. Wyodrębnij listę hotspotów z danych produktu
	const hotspotsForComponent = product.properties
		.filter((p) => p.hotspotX != null && p.hotspotY != null) // Użyj `!= null` aby złapać `null` i `undefined`
		.map((p) => ({
			propertyId: p.property.id,
			x: p.hotspotX!, // `!` oznacza, że jesteśmy pewni, że wartość nie jest nullem po filtrowaniu
			y: p.hotspotY!,
		}));

	// 2. Wyodrębnij pełną listę właściwości
	const allProperties: Property[] = product.properties.map((p) => p.property);

	// 3. Znajdź aktywną właściwość na podstawie jej ID
	const activeProperty = allProperties.find((p) => p.id === activePropertyId);

	// 4. Znajdź ID wybranego wariantu dla aktywnej właściwości
	const selectedVariantForActiveProp = activePropertyId ? designState.selectedVariants[activePropertyId] : undefined;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.headerContainer}>
					<Text style={styles.header}>DESIGN BLEZER</Text>
					{/* Przycisk Finish teraz jest na górze, jak w projekcie UI */}
					<StyledButton title="FINISH" onPress={handleFinish} variant="secondary" style={styles.finishButton} />
				</View>

				<ProductConfiguratorView
					productImage={
						product.mainImage?.url ? { uri: product.mainImage.url } : require("../../assets/Konfigurator_2.jpg") // Fallback do lokalnego obrazka
					}
					hotspots={hotspotsForComponent}
					activePropertyId={activePropertyId}
					selectedVariants={designState.selectedVariants}
					onHotspotPress={setActivePropertyId}
				/>

				<VariantSelector
					property={activeProperty}
					selectedVariantId={selectedVariantForActiveProp}
					onVariantSelect={handleVariantSelect}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FCFBF8",
	},
	scrollContent: {
		paddingBottom: 20,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		color: "red",
		marginBottom: 20,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	header: {
		fontSize: 18,
		fontWeight: "bold",
	},
	finishButton: {
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
});

export default ConfiguratorScreen;
