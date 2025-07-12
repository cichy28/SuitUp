import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Modal, Button, TouchableOpacity, Text } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HotspotImageView, { HotspotData } from "@/components/HotspotImageView";

const initialHotspots: HotspotData[] = [
	{ id: "neck", name: "Neck", value: "", relativeTop: 0.01, relativeLeft: 0.01 },
	{ id: "chest", name: "Chest", value: "", relativeTop: 0.25, relativeLeft: 0.5 },
	{ id: "waist", name: "Waist", value: "", relativeTop: 0.4, relativeLeft: 0.5 },
	{ id: "hips", name: "Hips", value: "", relativeTop: 0.55, relativeLeft: 0.5 },
	{ id: "inseam", name: "Inseam", value: "", relativeTop: 0.7, relativeLeft: 0.5 },
	{ id: "sleeve", name: "Sleeve", value: "", relativeTop: 0.3, relativeLeft: 0.2 },
];
import { RootStackParamList } from "@/navigation/AppNavigator";
import { Colors, Fonts, Spacing, BorderRadius } from "@/constants/Theme";

const IMAGE_ASPECT_RATIO = 750 / 1125;
const imageSource = require("../../assets/images/body-measurement.jpg");
const STORAGE_KEY = "userMeasurements";

const BriefScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [modalVisible, setModalVisible] = useState(false);
	const [currentHotspot, setCurrentHotspot] = useState<HotspotData | null>(null);
	const [measurement, setMeasurement] = useState("");
	const [hotspots, setHotspots] = useState<HotspotData[]>(initialHotspots);

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
			return;
		}
		navigation.navigate("StylePreferences", { measurements: hotspots });
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter your measurements</Text>
			<Text style={styles.subtitle}>We will use them to create your perfect fit.</Text>

			<View style={styles.imageContainer}>
				<HotspotImageView
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
						<Text style={styles.modalTitle}>Enter {currentHotspot?.name}</Text>
						<TextInput
							style={styles.input}
							onChangeText={setMeasurement}
							value={measurement}
							keyboardType="numeric"
							placeholder="cm"
						/>
						<Button title="Save" onPress={handleSave} color={Colors.primary} />
					</View>
				</View>
			</Modal>

			<TouchableOpacity style={styles.button} onPress={handleContinue}>
				<Text style={styles.buttonText}>Continue</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Spacing.medium,
		alignItems: "center",
		backgroundColor: Colors.background,
	},
	title: {
		fontSize: Fonts.sizes.title,
		fontWeight: Fonts.weights.bold,
		color: Colors.text,
		marginBottom: Spacing.small,
	},
	subtitle: {
		fontSize: Fonts.sizes.body,
		color: Colors.darkGray,
		marginBottom: Spacing.large,
		textAlign: "center",
	},
	imageContainer: {
		width: "100%",
		flex: 1,
		marginVertical: Spacing.medium,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalView: {
		margin: Spacing.medium,
		backgroundColor: Colors.white,
		borderRadius: BorderRadius.large,
		padding: Spacing.large,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: Fonts.sizes.subtitle,
		fontWeight: Fonts.weights.bold,
		color: Colors.text,
		marginBottom: Spacing.medium,
	},
	input: {
		height: 40,
		margin: Spacing.small,
		borderWidth: 1,
		borderColor: Colors.lightGray,
		padding: Spacing.medium,
		width: 200,
		textAlign: "center",
		borderRadius: BorderRadius.small,
	},
	button: {
		backgroundColor: Colors.primary,
		paddingVertical: Spacing.medium,
		paddingHorizontal: Spacing.large,
		borderRadius: BorderRadius.large,
		marginTop: Spacing.medium,
	},
	buttonText: {
		color: Colors.white,
		fontSize: Fonts.sizes.body,
		fontWeight: Fonts.weights.bold,
	},
});

export default BriefScreen;
