import React from "react";
import { View, StyleSheet } from "react-native";

interface Props {
	progress: number; // 0 to 1
}

const ProgressBar = ({ progress }: Props) => {
	return (
		<View style={styles.container}>
			<View style={[styles.bar, { width: `${progress * 100}%` }]} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 8,
		backgroundColor: "#E0E0E0",
		borderRadius: 4,
		overflow: "hidden",
	},
	bar: {
		height: "100%",
		backgroundColor: "#C88F54", // Brown color
		borderRadius: 4,
	},
});

export default ProgressBar;
