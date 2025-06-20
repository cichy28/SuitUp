import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useDesign } from "../context/DesignContext";
import StyledButton from "../components/StyledButton";
import { BodyShape, StylePreference } from "../../../shared/enums";

type BriefScreenNavigationProp = StackNavigationProp<RootStackParamList, "Brief">;

// Prosty komponent Checkbox
const Checkbox = ({
	label,
	value,
	onValueChange,
}: {
	label: string;
	value: boolean;
	onValueChange: (val: boolean) => void;
}) => (
	<TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
		<View style={[styles.checkbox, value && styles.checkboxChecked]}>
			{value && <Text style={styles.checkmark}>✓</Text>}
		</View>
		<Text style={styles.checkboxLabel}>{label}</Text>
	</TouchableOpacity>
);

const BriefScreen = () => {
	const navigation = useNavigation<BriefScreenNavigationProp>();
	const { dispatch } = useDesign();

	const [selectedShape, setSelectedShape] = useState<BodyShape | null>(null);
	const [preferences, setPreferences] = useState<StylePreference[]>([]);

	const togglePreference = (pref: StylePreference) => {
		setPreferences((prev) => (prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]));
	};

	const handleFinish = () => {
		if (selectedShape) {
			dispatch({ type: "SET_BRIEF", payload: { bodyShape: selectedShape, preferences: preferences } });
			navigation.navigate("Recommendation");
		} else {
			alert("Please select your body type.");
		}
	};

	return (
		<View style={styles.container}>
			{/* Tutaj powinien być ProgressBar */}
			<Text style={styles.header}>BRIEF</Text>

			<Text style={styles.title}>SELECT YOUR BODY TYPE</Text>
			{/* Tutaj powinny być ikony - uproszczone do tekstu */}
			<View style={styles.shapeSelector}>
				{(["INVERTED_TRIANGLE", "TRIANGLE", "HOURGLASS", "OVAL", "RECTANGLE"] as BodyShape[]).map((shape) => (
					<TouchableOpacity
						key={shape}
						style={[styles.shapeButton, selectedShape === shape && styles.shapeSelected]}
						onPress={() => setSelectedShape(shape)}
					>
						{/* TODO: Zastąpić ikonami */}
						<Text>{shape.substring(0, 1)}</Text>
					</TouchableOpacity>
				))}
			</View>

			<Text style={styles.title}>I LIKE</Text>
			<View style={styles.prefsContainer}>
				<Checkbox
					label="FITTED WEAR"
					value={preferences.includes("FITTED_WEAR")}
					onValueChange={() => togglePreference("FITTED_WEAR")}
				/>
				<Checkbox
					label="OVERSIZE WEAR"
					value={preferences.includes("OVERSIZE_WEAR")}
					onValueChange={() => togglePreference("OVERSIZE_WEAR")}
				/>
				<Checkbox
					label="RETRO SHAPES"
					value={preferences.includes("RETRO_SHAPES")}
					onValueChange={() => togglePreference("RETRO_SHAPES")}
				/>
				<Checkbox
					label="MASCULINE SHAPES"
					value={preferences.includes("MASCULINE_SHAPES")}
					onValueChange={() => togglePreference("MASCULINE_SHAPES")}
				/>
			</View>

			<StyledButton title="FINISH" onPress={handleFinish} variant="secondary" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#FCFBF8" },
	header: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 20 },
	title: { fontSize: 16, color: "#555", marginVertical: 20 },
	shapeSelector: { flexDirection: "row", justifyContent: "space-around", marginBottom: 30 },
	shapeButton: {
		width: 50,
		height: 80,
		borderWidth: 2,
		borderColor: "#D3B89A",
		justifyContent: "center",
		alignItems: "center",
	},
	shapeSelected: { borderColor: "#82D4D4", backgroundColor: "rgba(130, 212, 212, 0.2)" },
	prefsContainer: { marginBottom: 40 },
	checkboxContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
	checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: "#82D4D4", marginRight: 10 },
	checkboxChecked: { backgroundColor: "#82D4D4" },
	checkmark: { color: "white", textAlign: "center" },
	checkboxLabel: { fontSize: 16, color: "#333" },
});

export default BriefScreen;
