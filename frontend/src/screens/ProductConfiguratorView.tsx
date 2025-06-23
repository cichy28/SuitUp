// w pliku: frontend/src/screens/ConfiguratorScreen.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDesign } from "@/context/DesignContext"; // Użycie nowego hooka
import { ProductImageView } from "@/components/ProductImageView";
import { ConfiguredParametersList } from "@/components/ConfiguredParametersList";
import VariantSelector from "@/components/VariantSelector";
import StyledButton from "@/components/StyledButton";
import ProgressBar from "@/components/ProgressBar";
import { Hotspot } from "shared/validators/hotspot";
import { Property } from "shared/validators/property"; // Załóżmy, że te typy istnieją
import { PropertyVariant } from "shared/validators/propertyVariant"; // Załóżmy, że te typy istnieją

// Załóżmy, że dane produktu są pobierane z API
const MOCK_PRODUCT_IMAGE = "https://placehold.co/600x400/EEE/31343C";
const MOCK_PROPERTIES: (Property & { hotspots: Hotspot[]; propertyVariants: PropertyVariant[] })[] = [
	// Dane powinny pochodzić z API
];

const ProductConfiguratorView = () => {
	const { currentStep, totalSteps, selectedVariables, handleVariableChange, goToNextStep, goToPreviousStep } =
		useDesign();

	const [activeProperty, setActiveProperty] = useState<
		(Property & { hotspots: Hotspot[]; propertyVariants: PropertyVariant[] }) | undefined
	>(undefined);

	// Funkcja, która zostanie przekazana do ProductImageView
	const handleHotspotPress = (hotspot: Hotspot) => {
		// Znajdź właściwość (parametr) powiązaną z tym hotspotem
		const property = MOCK_PROPERTIES.find((p) => p.id === hotspot.propertyId);
		setActiveProperty(property);
	};

	const handleVariantSelect = (variantId: string) => {
		if (activeProperty) {
			handleVariableChange(activeProperty.id, variantId);
			setActiveProperty(undefined); // Zamknij selektor po wyborze
		}
	};

	const hotspots = MOCK_PROPERTIES.flatMap((p) => p.hotspots);
	const selectedPropertyIds = Object.keys(selectedVariables);

	// Przygotowanie danych dla ConfiguredParametersList
	const selectedVariantsForList = MOCK_PROPERTIES.reduce(
		(acc, prop) => {
			const selectedVariantId = selectedVariables[prop.id];
			if (selectedVariantId) {
				acc[prop.id] = prop.propertyVariants.find((v) => v.id === selectedVariantId);
			}
			return acc;
		},
		{} as { [propertyId: string]: PropertyVariant | undefined }
	);

	return (
		<SafeAreaView style={styles.container}>
			<ProgressBar progress={currentStep / totalSteps} />

			<View style={styles.imageContainer}>
				<ProductImageView
					imageUrl={MOCK_PRODUCT_IMAGE}
					hotspots={hotspots}
					selectedPropertyIds={selectedPropertyIds}
					onHotspotPress={handleHotspotPress}
					activeHotspotId={activeProperty?.hotspots[0]?.id} // Założenie: jeden hotspot na właściwość
				/>
			</View>

			<View style={styles.selectorContainer}>
				<VariantSelector
					property={activeProperty}
					selectedVariantId={activeProperty ? selectedVariables[activeProperty.id] : undefined}
					onVariantSelect={handleVariantSelect}
				/>
			</View>

			<ConfiguredParametersList properties={MOCK_PROPERTIES} selectedVariants={selectedVariantsForList} />

			<View style={styles.navigationButtons}>
				<StyledButton title="Wstecz" onPress={goToPreviousStep} disabled={currentStep === 1} />
				<StyledButton title="Dalej" onPress={goToNextStep} disabled={currentStep === totalSteps} />
			</View>
		</SafeAreaView>
	);
};

// ... reszta pliku, w tym style
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#fff" },
	imageContainer: { flex: 3 }, // Więcej miejsca na obraz
	selectorContainer: { flex: 2 }, // Miejsce na selektor wariantów
	navigationButtons: { flexDirection: "row", justifyContent: "space-around", padding: 20 },
});

export default ProductConfiguratorView; // Pamiętaj, aby opakować go w DesignProvider w nawigacji
