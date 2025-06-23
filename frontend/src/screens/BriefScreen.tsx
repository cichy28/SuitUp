import React, { useState } from "react";
import { View, TouchableOpacity, Modal, TextInput, Button, StyleSheet, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/AppNavigator";
import InteractiveImageView, { HotspotData } from "@/components/InteractiveImageView";

// Definicja stałych dla obrazka pozostaje w screenie, który go używa
const YOUR_IMAGE_WIDTH = 458;
const YOUR_IMAGE_HEIGHT = 882;
const IMAGE_ASPECT_RATIO = YOUR_IMAGE_WIDTH / YOUR_IMAGE_HEIGHT;
const imageSource = require("../../assets/images/body-measurement.jpg");

// Definicja hotspotów dla tego konkretnego ekranu
const initialHotspots: HotspotData[] = [
	{ id: 1, name: "Shoulder", value: "", relativeTop: 0.22, relativeLeft: 0.5 },
	{ id: 2, name: "Chest", value: "", relativeTop: 0.3, relativeLeft: 0.38 },
	{ id: 3, name: "Chest", value: "", relativeTop: 0.3, relativeLeft: 0.62 },
	{ id: 4, name: "Sleeve", value: "", relativeTop: 0.45, relativeLeft: 0.25 },
	{ id: 5, name: "Sleeve", value: "", relativeTop: 0.45, relativeLeft: 0.75 },
	{ id: 6, name: "Waist", value: "", relativeTop: 0.48, relativeLeft: 0.5 },
	{ id: 7, name: "Hips", value: "", relativeTop: 0.58, relativeLeft: 0.4 },
	{ id: 8, name: "Hips", value: "", relativeTop: 0.58, relativeLeft: 0.6 },
	{ id: 9, name: "Inseam", value: "", relativeTop: 0.75, relativeLeft: 0.5 },
];

const BriefScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	const [modalVisible, setModalVisible] = useState(false);
	const [currentHotspot, setCurrentHotspot] = useState<HotspotData | null>(null);
	const [measurement, setMeasurement] = useState("");
	const [hotspots, setHotspots] = useState<HotspotData[]>(initialHotspots);

	const handleHotspotPress = (hotspot: HotspotData) => {
		setCurrentHotspot(hotspot);
		setMeasurement(hotspot.value);
		setModalVisible(true);
	};

	const handleSave = () => {
		if (currentHotspot) {
			setHotspots(hotspots.map((h) => (h.id === currentHotspot.id ? { ...h, value: measurement } : h)));
		}
		setModalVisible(false);
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

			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ProductConfigurator")}>
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
