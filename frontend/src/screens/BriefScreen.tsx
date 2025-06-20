import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StyledButton from "../components/StyledButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDesign } from "../context/DesignContext";

// Definicja typów dla stacku nawigacji, jeśli jeszcze nie masz
type RootStackParamList = {
	Welcome: undefined;
	Brief: undefined;
	Configurator: undefined; // Dodajemy ekran Configurator do typów
	// Dodaj inne ekrany, jeśli są potrzebne
};

type BriefScreenNavigationProp = StackNavigationProp<RootStackParamList, "Brief">;

const BriefScreen = () => {
	// --- POCZĄTEK ZMIANY ---
	// Pobieramy cały obiekt navigation
	const navigation = useNavigation<BriefScreenNavigationProp>();
	// --- KONIEC ZMIANY ---

	const [brief, setBrief] = useState("");
	const { goToNextStep } = useDesign();

	const handleFinish = () => {
		console.log("Brief:", brief);
		// goToNextStep(); // Ta funkcja z kontekstu zarządza krokami, a nie nawigacją

		// --- POCZĄTEK ZMIANY ---
		// Używamy navigation.navigate do przejścia do następnego ekranu
		navigation.navigate("Configurator");
		// --- KONIEC ZMIANY ---
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.title}>Opisz nam swoje potrzeby</Text>
				<Text style={styles.subtitle}>
					Opisz, jakiego ubrania potrzebujesz, na jaką okazję, w jakim stylu. Im więcej szczegółów, tym lepsze
					rekomendacje będziemy mogli Ci dać.
				</Text>
				<TextInput
					style={styles.input}
					multiline
					placeholder="Np. Potrzebuję garnituru na ślub kolegi, który odbędzie się latem. Lubię styl klasyczny, ale z nowoczesnym twistem. Kolor granatowy lub szary."
					value={brief}
					onChangeText={setBrief}
				/>
			</ScrollView>
			<StyledButton title="Zakończ" onPress={handleFinish} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
	},
	scrollContent: {
		flexGrow: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		padding: 15,
		fontSize: 16,
		minHeight: 200,
		textAlignVertical: "top", // Zapewnia, że tekst w multiline input zaczyna się od góry
	},
});

export default BriefScreen;
