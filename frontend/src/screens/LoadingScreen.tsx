import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, "Loading">;

const LoadingScreen = () => {
	const navigation = useNavigation<LoadingScreenNavigationProp>();

	useEffect(() => {
		// Symulacja ładowania
		const timer = setTimeout(() => {
			navigation.replace("Welcome");
		}, 3000);
		return () => clearTimeout(timer);
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Image source={require("../../assets/loading.jpg")} style={styles.backgroundImage} />
			{/* Można dodać logo lub inne elementy, jeśli są potrzebne */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backgroundImage: {
		width: "100%",
		height: "100%",
		resizeMode: "cover",
	},
});

export default LoadingScreen;
