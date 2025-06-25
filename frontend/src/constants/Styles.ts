import { StyleSheet } from "react-native";

export const Spacing = {
	small: 8,
	medium: 16,
	large: 24,
	xLarge: 32,
};

export const Typography = {
	fontSize: {
		small: 12,
		medium: 16,
		large: 20,
		xLarge: 24,
	},
	fontWeight: {
		light: "300" as "300",
		regular: "400" as "400",
		bold: "700" as "700",
	},
};

export const GlobalStyles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Spacing.medium,
	},
	title: {
		fontSize: Typography.fontSize.xLarge,
		fontWeight: Typography.fontWeight.bold,
	},
	subtitle: {
		fontSize: Typography.fontSize.large,
		fontWeight: Typography.fontWeight.regular,
	},
});
