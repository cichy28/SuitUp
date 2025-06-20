import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StyledButton from "../components/StyledButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDesign } from "../context/DesignContext";

// Definicja typów dla stacku nawigacji, jeśli jeszcze nie masz
type RootStackParamList = {
	Welcome: undefined;
	Brief: undefined;
	// Dodaj inne ekrany, jeśli są potrzebne
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

const WelcomeScreen = () => {
	// --- POCZĄTEK ZMIANY ---
	// Pobieramy cały obiekt navigation, a nie tylko dispatch
	const navigation = useNavigation<WelcomeScreenNavigationProp>();
	// --- KONIEC ZMIANY ---

	const { goToNextStep } = useDesign();

	const handleStart = () => {
		// goToNextStep(); // Ta funkcja z kontekstu nie nawiguje między ekranami
		// --- POCZĄTEK ZMIANY ---
		// Wywołujemy dispatch jako metodę obiektu navigation
		navigation.navigate("Brief"); // Używamy navigate do przejścia do ekranu Brief
		// --- KONIEC ZMIANY ---
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Image source={require("../../assets/images/logo.jpg")} style={styles.logo} />
				<Text style={styles.title}>Witaj w SuitUp</Text>
				<Text style={styles.subtitle}>Spersonalizuj swoje ubranie w kilku prostych krokach.</Text>
			</View>
			<StyledButton title="Rozpocznij" onPress={handleStart} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 20,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		width: 150,
		height: 150,
		resizeMode: "contain",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		paddingHorizontal: 20,
	},
});

export default WelcomeScreen;
