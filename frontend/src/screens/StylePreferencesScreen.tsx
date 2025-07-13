import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import StyledButton from "@/components/StyledButton";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { HotspotData } from "@/components/InteractiveImageView";
import { BodyShape, StylePreference } from "../../../shared/enums";
import { Colors, Fonts, Spacing, BorderRadius } from "@/constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StylePreferencesScreenNavigationProp = RouteProp<RootStackParamList, "StylePreferences">;

const BODY_SHAPE_KEY = "userBodyShape";
const STYLE_PREFS_KEY = "userStylePreferences";

const classifyBodyShape = (measurements: HotspotData[]): BodyShape => {
	const getMeasurement = (id: string) => {
		const measurement = measurements.find((m) => m.id === id);
		return measurement ? parseFloat(measurement.value) : 0;
	};

	const chest = getMeasurement("chest");
	const waist = getMeasurement("waist");
	const hips = getMeasurement("hips");

	// Define a small tolerance for comparisons to account for minor variations
	const tolerance = 0.05; // 5% tolerance

	// Helper to check if A is significantly wider than B
	const isWider = (a: number, b: number) => a > b * (1 + tolerance);

	// Helper to check if A is significantly narrower than B
	const isNarrower = (a: number, b: number) => a < b * (1 - tolerance);

	// Helper to check if A and B are roughly similar
	const isSimilar = (a: number, b: number) => Math.abs(a - b) <= b * tolerance;

	// Triangle (Gruszka): Biodra są wyraźnie szersze od klatki piersiowej.
	if (isWider(hips, chest)) {
		return BodyShape.enum.TRIANGLE;
	}

	// Odwrócony Trójkąt: Klatka piersiowa jest wyraźnie szersza od bioder.
	if (isWider(chest, hips)) {
		return BodyShape.enum.INVERTED_TRIANGLE;
	}

	// Klepsydra: Klatka piersiowa i biodra mają zbliżony wymiar, a talia jest wyraźnie węższa.
	if (isSimilar(chest, hips) && isNarrower(waist, chest)) {
		return BodyShape.enum.HOURGLASS;
	}

	// Owal (Jabłko): Talia jest szersza od klatki piersiowej i bioder.
	if (isWider(waist, chest) && isWider(waist, hips)) {
		return BodyShape.enum.OVAL;
	}

	// Prostokąt: Klatka piersiowa, talia i biodra mają zbliżone wymiary.
	if (isSimilar(chest, waist) && isSimilar(waist, hips)) {
		return BodyShape.enum.RECTANGLE;
	}

	// Default or fallback if no specific shape is clearly identified
	return BodyShape.enum.RECTANGLE; // Or a more appropriate default
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
		navigation.navigate("Recommendation", { bodyShape, selectedStyles });
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.header}>YOUR BODY TYPE</Text>
				<View style={styles.shapeSelector}>
					{BODY_SHAPES_OPTIONS.map((option) => (
						<TouchableOpacity
							key={option.type}
							style={[
								styles.shapeOption,
								bodyShape === option.type && styles.selectedShapeOption,
							]}
						>
							<Image
								source={option.icon}
								style={styles.shapeIcon}
							/>
						</TouchableOpacity>
					))}
				</View>

				<Text style={styles.header}>I LIKE</Text>
				<View style={styles.styleSelector}>
					{STYLE_PREFERENCES_OPTIONS.map((option) => (
						<TouchableOpacity
							key={option.id}
							style={styles.styleOption}
							onPress={() => toggleStylePreference(option.id)}
						>
							<Text style={styles.styleLabel}>{option.label}</Text>
							<View style={[styles.checkbox, selectedStyles.includes(option.id) && styles.checkboxSelected]}>
								{selectedStyles.includes(option.id) && <View style={styles.checkboxInner} />}
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>
			<StyledButton title="Finish" onPress={handleFinish} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Spacing.medium,
		justifyContent: "space-between",
		backgroundColor: Colors.background,
	},
	content: {
		flex: 1,
	},
	header: {
		fontSize: Fonts.sizes.subtitle,
		fontWeight: Fonts.weights.bold,
		color: Colors.text,
		marginVertical: Spacing.large,
		textAlign: "center",
		letterSpacing: 1.5,
	},
	shapeSelector: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: Spacing.large,
	},
	shapeOption: {
		alignItems: "center",
		padding: Spacing.small, // Add padding to make space for the border
		borderRadius: BorderRadius.medium, // Match border radius with the image
	},
	selectedShapeOption: {
		borderWidth: 2,
		borderColor: Colors.primary, // Use a color from your theme
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
		fontSize: Fonts.sizes.body,
		color: Colors.text,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderWidth: 2,
		borderColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: BorderRadius.small,
	},
	checkboxSelected: {
		backgroundColor: Colors.primary,
	},
	checkboxInner: {
		width: 12,
		height: 12,
		backgroundColor: Colors.white,
	},
});

export default StylePreferencesScreen;
