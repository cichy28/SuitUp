// frontend/src/components/ConfiguredParametersList.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

// Załóżmy, że mamy takie typy (powinny pochodzić z shared)
type Property = { id: string; name: string };
type SelectedVariant = { id: string; name: string };

interface Props {
	properties: Property[];
	selectedVariants: { [propertyId: string]: SelectedVariant | undefined };
}

export const ConfiguredParametersList = ({ properties, selectedVariants }: Props) => {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle">Wybrane parametry:</ThemedText>
			{properties.map((prop) => {
				const selectedVariant = selectedVariants[prop.id];
				return (
					<View key={prop.id} style={styles.row}>
						<ThemedText style={styles.propertyName}>{prop.name}:</ThemedText>
						<ThemedText style={styles.propertyValue}>
							{selectedVariant ? selectedVariant.name : "Nie wybrano"}
						</ThemedText>
					</View>
				);
			})}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderTopWidth: 1,
		borderColor: "#eee",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
	},
	propertyName: {
		fontWeight: "bold",
	},
	propertyValue: {
		color: "#555",
	},
});
