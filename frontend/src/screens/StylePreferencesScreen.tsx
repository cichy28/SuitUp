import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import StyledButton from "@/components/StyledButton";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { HotspotData } from "@/components/InteractiveImageView";
import { BodyShape, StylePreference } from "../../../shared/enums";
import { Spacing, Typography } from "@/constants/Styles";
import AsyncStorage from "@react-native-async-storage/async-storage"; // KROK 1: Import

type StylePreferencesScreenNavigationProp = RouteProp<RootStackParamList, "StylePreferences">;

// Klucze do AsyncStorage
const BODY_SHAPE_KEY = "userBodyShape";
const STYLE_PREFS_KEY = "userStylePreferences";

const classifyBodyShape = (measurements: HotspotData[]): BodyShape => {
	console.log("Klasyfikacja na podstawie pomiarów:", measurements);
	return BodyShape.enum.INVERTED_TRIANGLE;
};

const BODY_SHAPES_OPTIONS = [
	{ type: BodyShape.enum.TRIANGLE, icon: require("../../assets/images/triangle.png") },
	{ type: BodyShape.enum.INVERTED_TRIANGLE, icon: require("../../assets/images/inverted-triangle.png") },
	{ type: BodyShape.enum.HOURGLASS, icon: require("../../assets/images/hourglass.png") },
	{ type: BodyShape.enum.OVAL, icon: require("../../assets/images/oval.png") },
	{ type: BodyShape.enum.RECTANGLE, icon: require("../../assets/images/rectangle.png") },
];

const STYLE_PREFERENCES_OPTIONS = [
	{ id: StylePreference.enum.FITTED_WEAR, label: "Fitted Wear" },
	{ id: StylePreference.enum.OVERSIZE_WEAR, label: "Oversize Wear" },
	{ id: StylePreference.enum.RETRO_SHAPES, label: "Retro Shapes" },
	{ id: StylePreference.enum.MASCULINE_SHAPES, label: "Masculine Shapes" },
];

const StylePreferencesScreen = () => {
	const navigation = useNavigation();
	const route = useRoute<StylePreferencesScreenNavigationProp>();
	const { measurements } = route.params;

	const [bodyShape, setBodyShape] = useState<BodyShape | null>(null);
	const [selectedStyles, setSelectedStyles] = useState<StylePreference[]>([]);

	// KROK 2: Wczytanie zapisanych preferencji przy starcie
	useEffect(() => {
		const loadPreferences = async () => {
			try {
				const savedBodyShape = await AsyncStorage.getItem(BODY_SHAPE_KEY);
				const savedStyles = await AsyncStorage.getItem(STYLE_PREFS_KEY);
				if (savedBodyShape !== null) {
					setBodyShape(JSON.parse(savedBodyShape));
				}
				if (savedStyles !== null) {
					setSelectedStyles(JSON.parse(savedStyles));
				}
			} catch (e) {
				console.error("Failed to load preferences from storage.", e);
			}
		};
		loadPreferences();
	}, []);

	// KROK 3: Klasyfikacja i zapis typu sylwetki
	useEffect(() => {
		const classifyAndSaveShape = async () => {
			const shape = classifyBodyShape(measurements);
			setBodyShape(shape);
			try {
				await AsyncStorage.setItem(BODY_SHAPE_KEY, JSON.stringify(shape));
			} catch (e) {
				console.error("Failed to save body shape to storage.", e);
			}
		};
		classifyAndSaveShape();
	}, [measurements]);

	// KROK 4: Zapis preferencji stylu przy każdej zmianie
	const toggleStylePreference = async (style: StylePreference) => {
		const newStyles = selectedStyles.includes(style)
			? selectedStyles.filter((s) => s !== style)
			: [...selectedStyles, style];
		setSelectedStyles(newStyles);
		try {
			await AsyncStorage.setItem(STYLE_PREFS_KEY, JSON.stringify(newStyles));
		} catch (e) {
			console.error("Failed to save style preferences to storage.", e);
		}
	};

	const handleFinish = () => {
		console.log("Zakończono! Wybrana sylwetka:", bodyShape);
		console.log("Wybrane style:", selectedStyles);
		// Nawigacja do ekranu z rekomendacjami, przekazując zebrane dane
		// navigation.navigate("Recommendation", { bodyShape, selectedStyles });
	};

	return (
		<ThemedView style={styles.container}>
			<View style={styles.content}>
				<ThemedText type="subtitle" style={styles.header}>
					YOUR BODY TYPE
				</ThemedText>
				<View style={styles.shapeSelector}>
					{BODY_SHAPES_OPTIONS.map((option) => (
						<TouchableOpacity key={option.type} style={styles.shapeOption}>
							<Image
								source={option.icon}
								style={[styles.shapeIcon, bodyShape === option.type && styles.selectedShapeIcon]}
							/>
						</TouchableOpacity>
					))}
				</View>

				<ThemedText type="subtitle" style={styles.header}>
					I LIKE
				</ThemedText>
				<View style={styles.styleSelector}>
					{STYLE_PREFERENCES_OPTIONS.map((option) => (
						<TouchableOpacity
							key={option.id}
							style={styles.styleOption}
							onPress={() => toggleStylePreference(option.id)}
						>
							<ThemedText style={styles.styleLabel}>{option.label}</ThemedText>
							<View style={[styles.checkbox, selectedStyles.includes(option.id) && styles.checkboxSelected]}>
								{selectedStyles.includes(option.id) && <View style={styles.checkboxInner} />}
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>
			<StyledButton title="Finish" onPress={handleFinish} />
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Spacing.medium,
		justifyContent: "space-between",
	},
	content: {
		flex: 1,
	},
	header: {
		marginVertical: Spacing.large,
		textAlign: "center",
		letterSpacing: 1.5,
	},
	shapeSelector: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: Spacing.xLarge,
	},
	shapeOption: {
		alignItems: "center",
	},
	shapeIcon: {
		width: 50,
		height: 100,
		resizeMode: "contain",
		opacity: 0.5,
	},
	selectedShapeIcon: {
		opacity: 1,
	},
	styleSelector: {
		paddingHorizontal: Spacing.medium,
	},
	styleOption: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: Spacing.medium,
	},
	styleLabel: {
		fontSize: Typography.fontSize.large,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderWidth: 2,
		borderColor: "#82D4D4",
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxSelected: {
		backgroundColor: "#82D4D4",
	},
	checkboxInner: {
		width: 12,
		height: 12,
		backgroundColor: "white",
	},
});

export default StylePreferencesScreen;
