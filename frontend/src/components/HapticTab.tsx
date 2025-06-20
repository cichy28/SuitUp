import * as Haptics from "expo-haptics";
import React from "react";
// Zmieniamy TouchableOpacity na Pressable
import { Text, View, StyleSheet, Pressable } from "react-native";

type Tab = {
	title: string;
	onPress: () => void;
};

type HapticTabProps = {
	tabs: Tab[];
};

const HapticTab = ({ tabs }: HapticTabProps) => {
	const handlePress = (onPress: () => void) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onPress();
	};

	return (
		<View style={styles.container}>
			{tabs.map((tab, index) => (
				// Używamy Pressable zamiast TouchableOpacity
				<Pressable
					key={index}
					// Pressable pozwala na dynamiczne stylowanie w zależności od stanu (np. naciśnięcia)
					style={({ pressed }) => [
						styles.tab,
						index === 0 && styles.firstTab,
						pressed && styles.tabPressed, // Dodajemy styl dla stanu "naciśnięty"
					]}
					onPress={() => handlePress(tab.onPress)}
				>
					<Text style={styles.tabText}>{tab.title}</Text>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	tab: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderColor: "#ddd",
		backgroundColor: "white",
		marginLeft: -1, // Powoduje nakładanie się ramek
	},
	firstTab: {
		borderTopLeftRadius: 20,
		borderBottomLeftRadius: 20,
		marginLeft: 0,
	},
	tabPressed: {
		backgroundColor: "#f0f0f0", // Efekt wizualny naciśnięcia
	},
	tabText: {
		fontWeight: "bold",
		color: "#333",
	},
});

export { HapticTab };
