import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Modal, Button, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // KROK 1: Import
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import InteractiveImageView, { HotspotData, initialHotspots } from "@/components/InteractiveImageView";
import { RootStackParamList } from "@/navigation/AppNavigator";

const IMAGE_ASPECT_RATIO = 750 / 1125;
const imageSource = require("../../assets/images/body-measurement.jpg");
const STORAGE_KEY = "userMeasurements";

const BriefScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [modalVisible, setModalVisible] = useState(false);
	const [currentHotspot, setCurrentHotspot] = useState<HotspotData | null>(null);
	const [measurement, setMeasurement] = useState("");
	const [hotspots, setHotspots] = useState<HotspotData[]>(initialHotspots);

	// KROK 2: Wczytywanie danych przy starcie ekranu
	useEffect(() => {
		const loadMeasurements = async () => {
			try {
				const savedMeasurements = await AsyncStorage.getItem(STORAGE_KEY);
				if (savedMeasurements !== null) {
					setHotspots(JSON.parse(savedMeasurements));
				}
			} catch (e) {
				console.error("Failed to load measurements from storage.", e);
			}
		};
		loadMeasurements();
	}, []);

	const handleHotspotPress = (hotspot: HotspotData) => {
		setCurrentHotspot(hotspot);
		setMeasurement(hotspot.value);
		setModalVisible(true);
	};

	// KROK 3: Zapisywanie danych po każdej zmianie
	const handleSave = async () => {
		if (currentHotspot) {
			const newHotspots = hotspots.map((h) => (h.id === currentHotspot.id ? { ...h, value: measurement } : h));
			setHotspots(newHotspots);
			try {
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHotspots));
			} catch (e) {
				console.error("Failed to save measurements to storage.", e);
			}
		}
		setModalVisible(false);
	};

	const handleContinue = () => {
		const allMeasurementsEntered = hotspots.every((h) => h.value.trim() !== "");
		if (!allMeasurementsEntered) {
			console.log("Proszę wprowadzić wszystkie wymiary.");
			// Tutaj można dodać alert dla użytkownika
			return;
		}
		navigation.navigate("StylePreferences", { measurements: hotspots });
	};

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Enter your measurements</ThemedText>
			<ThemedText>We will use them to create your perfect fit.</ThemedText>

			<View style={styles.imageContainer}>
				<InteractiveImageView
					source={imageSource}
					aspectRatio={IMAGE_ASPECT_RATIO}
					hotspots={hotspots}
					onHotspotPress={handleHotspotPress}
				/>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalView}>
						<ThemedText type="subtitle">Enter {currentHotspot?.name}</ThemedText>
						<TextInput
							style={styles.input}
							onChangeText={setMeasurement}
							value={measurement}
							keyboardType="numeric"
							placeholder="cm"
						/>
						<Button title="Save" onPress={handleSave} />
					</View>
				</View>
			</Modal>

			<TouchableOpacity style={styles.button} onPress={handleContinue}>
				<ThemedText style={styles.buttonText}>Continue</ThemedText>
			</TouchableOpacity>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		alignItems: "center",
	},
	imageContainer: {
		width: "100%",
		flex: 1,
		marginVertical: 20,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		width: 200,
		textAlign: "center",
		borderRadius: 5,
	},
	button: {
		backgroundColor: "#007AFF",
		paddingVertical: 15,
		paddingHorizontal: 40,
		borderRadius: 25,
		marginTop: 20,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default BriefScreen;
