import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useDesign } from "../context/DesignContext";
import StyledButton from "../components/StyledButton";

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

const WelcomeScreen = () => {
	const navigation = useNavigation<WelcomeScreenNavigationProp>();
	const { dispatch } = useDesign();
	const [name, setName] = useState("");

	const handleStart = () => {
		dispatch({ type: "SET_DESIGN_NAME", payload: name || "My First Design" });
		navigation.navigate("Brief");
	};

	return (
		<ImageBackground source={require("../../assets/start.jpg")} style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>WELCOME MONIKA!</Text>
				<Text style={styles.label}>FIRST DESIGN NAME</Text>
				<TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g., My Awesome Blazer" />
				<StyledButton title="START" onPress={handleStart} />
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		resizeMode: "cover",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "rgba(255,255,255,0.3)",
	},
	title: {
		fontSize: 24,
		color: "#444",
		marginBottom: 80,
	},
	label: {
		fontSize: 16,
		color: "#555",
		marginBottom: 10,
	},
	input: {
		borderBottomWidth: 1,
		borderColor: "#555",
		width: "80%",
		textAlign: "center",
		fontSize: 18,
		padding: 10,
		marginBottom: 60,
	},
});

export default WelcomeScreen;
