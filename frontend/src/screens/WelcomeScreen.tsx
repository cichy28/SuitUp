import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StyledButton from "../components/StyledButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDesign } from "../context/DesignContext";
import { Colors, Fonts, Spacing } from '../constants/Theme';

type RootStackParamList = {
	Welcome: undefined;
	Brief: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

const WelcomeScreen = () => {
	const navigation = useNavigation<WelcomeScreenNavigationProp>();
	const { goToNextStep } = useDesign();

	const handleStart = () => {
		navigation.navigate("Brief");
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
		backgroundColor: Colors.background,
		padding: Spacing.medium,
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
		marginBottom: Spacing.large,
	},
	title: {
		fontSize: Fonts.sizes.title,
		fontWeight: Fonts.weights.bold,
		color: Colors.text,
		marginBottom: Spacing.small,
	},
	subtitle: {
		fontSize: Fonts.sizes.subtitle,
		color: Colors.darkGray,
		textAlign: "center",
		paddingHorizontal: Spacing.large,
	},
});

export default WelcomeScreen;
