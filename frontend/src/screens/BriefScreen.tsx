import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	TextInput,
	Modal,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StyledButton from "../components/StyledButton";
import { RootStackParamList } from "../navigation/AppNavigator";

// Definicja typu dla pojedynczego punktu pomiarowego
type MeasurementPoint = {
	id: string;
	label: string;
	// Pozycje w procentach, aby były responsywne
	x: string;
	y: string;
};

// Zahardcodowane pozycje hotspotów (w procentach)
const MEASUREMENT_POINTS: MeasurementPoint[] = [
	{ id: "chest", label: "Klatka piersiowa", x: "60%", y: "25%" },
	{ id: "waist", label: "Talia", x: "40%", y: "42%" },
	{ id: "hips", label: "Biodra", x: "65%", y: "55%" },
	{ id: "sleeve", label: "Długość rękawa", x: "80%", y: "30%" },
	{ id: "neck", label: "Obwód szyi", x: "55%", y: "15%" },
];

type BriefScreenNavigationProp = StackNavigationProp<RootStackParamList, "Brief">;

const BriefScreen = () => {
	const navigation = useNavigation<BriefScreenNavigationProp>();

	// Stan do przechowywania wprowadzonych wymiarów
	const [measurements, setMeasurements] = useState<{ [key: string]: string }>({});
	// Stan do obsługi modala do wprowadzania danych
	const [isModalVisible, setModalVisible] = useState(false);
	const [currentPoint, setCurrentPoint] = useState<MeasurementPoint | null>(null);
	const [inputValue, setInputValue] = useState("");

	const handleHotspotPress = (point: MeasurementPoint) => {
		setCurrentPoint(point);
		setInputValue(measurements[point.id] || ""); // Ustaw aktualną wartość w inpucie
		setModalVisible(true);
	};

	const handleSaveMeasurement = () => {
		if (currentPoint) {
			setMeasurements((prev) => ({
				...prev,
				[currentPoint.id]: inputValue,
			}));
		}
		setModalVisible(false);
		setCurrentPoint(null);
		setInputValue("");
	};

	const handleNext = () => {
		console.log("Zebrane wymiary:", measurements);
		// Na razie tylko nawigujemy dalej, bez przekazywania danych
		navigation.navigate("Configurator", { productId: "dummy-product-id" }); // Przekazujemy tymczasowe ID produktu
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Wprowadź swoje wymiary</Text>
			<Text style={styles.subtitle}>Kliknij na punkty, aby dodać pomiar.</Text>

			<View style={styles.imageContainer}>
				<Image
					source={require("../../assets/images/body-measurement.jpg")}
					style={styles.bodyImage}
					resizeMode="contain"
				/>
				{MEASUREMENT_POINTS.map((point) => (
					<TouchableOpacity
						key={point.id}
						style={[styles.hotspot, { top: point.y, left: point.x }]}
						onPress={() => handleHotspotPress(point)}
					>
						<Text style={styles.hotspotText}>{measurements[point.id] || "+"}</Text>
					</TouchableOpacity>
				))}
			</View>

			<StyledButton title="Dalej" onPress={handleNext} style={styles.nextButton} />

			{/* Modal do wprowadzania danych */}
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBackdrop}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>{currentPoint?.label}</Text>
						<TextInput
							style={styles.input}
							placeholder="Wpisz wymiar w cm"
							keyboardType="numeric"
							value={inputValue}
							onChangeText={setInputValue}
							autoFocus={true}
						/>
						<StyledButton title="Zapisz" onPress={handleSaveMeasurement} />
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f7f7f7",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginBottom: 20,
	},
	imageContainer: {
		width: "100%",
		height: "65%", // Dopasuj wysokość do swoich potrzeb
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
	},
	bodyImage: {
		width: "100%",
		height: "100%",
	},
	hotspot: {
		position: "absolute",
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(10, 126, 164, 0.7)", // Kolor z przycisku "Save"
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "white",
	},
	hotspotText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	nextButton: {
		marginTop: "auto", // Przycisk na dole
		width: "100%",
	},
	// Style dla Modala
	modalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
	},
	input: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		padding: 15,
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
	},
});

export default BriefScreen;
