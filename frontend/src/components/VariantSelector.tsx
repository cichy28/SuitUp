import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Property } from "../../../shared/types"; // Importujemy podstawowy typ

interface Props {
	/** Obiekt aktywnej właściwości, której warianty mają być wyświetlone */
	property: Property | undefined;
	/** ID aktualnie wybranego wariantu dla danej właściwości */
	selectedVariantId: string | undefined;
	/** Funkcja zwrotna wywoływana po wybraniu wariantu. Przekazuje ID wybranego wariantu. */
	onVariantSelect: (variantId: string) => void;
}

const VariantSelector = ({ property, selectedVariantId, onVariantSelect }: Props) => {
	if (!property) {
		// Jeśli żadna właściwość nie jest aktywna, nie renderuj nic
		return null;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{property.name.toUpperCase()}</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
				{property.propertyVariants.map((variant) => {
					const isSelected = variant.id === selectedVariantId;

					return (
						<TouchableOpacity
							key={variant.id}
							style={[styles.option, isSelected && styles.optionSelected]}
							onPress={() => onVariantSelect(variant.id)}
						>
							<Image
								// W prawdziwej aplikacji URL pochodziłby z variant.image.url
								source={variant.image?.url ? { uri: variant.image.url } : require("../../assets/button.png")}
								style={styles.optionImage}
								resizeMode="cover"
							/>
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingVertical: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#444",
		marginLeft: 16,
		marginBottom: 12,
	},
	scrollContent: {
		paddingHorizontal: 16,
	},
	option: {
		width: 80,
		height: 80,
		borderRadius: 12,
		marginRight: 12,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "transparent",
		overflow: "hidden",
	},
	optionSelected: {
		borderColor: "#C88F54", // Kolor brązowy dla zaznaczenia
	},
	optionImage: {
		width: "100%",
		height: "100%",
	},
});

export default VariantSelector;
