import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";

import { HapticTab } from "@/components/HapticTab";
import ProgressBar from "@/components/ProgressBar";
import StyledButton from "@/components/StyledButton";
import { DesignContext, DesignProvider } from "@/context/DesignContext";
import { Hotspot } from "shared/validators/hotspot"; // <<< IMPORT Z WALIDATORA

// LOKALNA DEFINICJA TYPU Hotspot ZOSTAŁA USUNIĘTA

type SelectedVariables = {
	[key: string]: string;
};

// Zaktualizowano DUMMY_HOTSPOTS, aby pasował do pełnej definicji typu
// (dodano productId i createdAt dla spójności)
const DUMMY_HOTSPOTS: Hotspot[] = [
	{
		id: "1",
		x: 100,
		y: 150,
		propertyId: "clgwlt0v70002yenvm167i7e8",
		productId: "clgwlssyq0000yenv25b3d7v4",
		createdAt: new Date(),
	},
	{
		id: "2",
		x: 200,
		y: 250,
		propertyId: "clgwlt0va0004yenvggtu2n1y",
		productId: "clgwlssyq0000yenv25b3d7v4",
		createdAt: new Date(),
	},
];

const ProductConfiguratorView = () => {
	const context = useContext(DesignContext);
	if (!context) {
		return <Text>Loading...</Text>;
	}
	const {
		currentStep,
		totalSteps,
		// selectedVariables, // Odkomentuj, gdy będzie używane
		handleVariableChange,
		goToNextStep,
		goToPreviousStep,
	} = context;

	// const handleSelectVariable = (propertyId: string, value: string) => { // Odkomentuj, gdy będzie używane
	// 	handleVariableChange(propertyId, value);
	// };

	return (
		<SafeAreaView style={styles.container}>
			<ProgressBar progress={currentStep / totalSteps} />
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: "https://placehold.co/600x400/EEE/31343C" }} // Wymień na obraz produktu
					style={styles.productImage}
					resizeMode="contain"
				/>
				{DUMMY_HOTSPOTS.map((hotspot) => (
					<View key={hotspot.id} style={[styles.hotspot, { left: hotspot.x, top: hotspot.y }]}>
						<Text style={styles.hotspotText}>+</Text>
					</View>
				))}
			</View>
			<View style={styles.optionsContainer}>
				<HapticTab
					tabs={[
						{
							title: "Kieszenie",
							onPress: () => {
								console.log("kieszenie");
							},
						},
						{
							title: "Pagony",
							onPress: () => {
								console.log("pagony");
							},
						},
						{
							title: "Rozporek",
							onPress: () => {
								console.log("rozporek");
							},
						},
					]}
				/>
			</View>

			<View style={styles.navigationButtons}>
				<StyledButton title="Wstecz" onPress={goToPreviousStep} disabled={currentStep === 1} />
				<StyledButton title="Dalej" onPress={goToNextStep} disabled={currentStep === totalSteps} />
			</View>

			<StatusBar style="auto" />
		</SafeAreaView>
	);
};

const ConfiguratorScreen = () => {
	return (
		<DesignProvider>
			<ProductConfiguratorView />
		</DesignProvider>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	imageContainer: {
		flex: 1,
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
	},
	productImage: {
		width: "100%",
		height: "100%",
	},
	hotspot: {
		position: "absolute",
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	hotspotText: {
		color: "white",
		fontWeight: "bold",
	},
	optionsContainer: {
		padding: 20,
	},
	navigationButtons: {
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 20,
	},
});

export default ConfiguratorScreen;
