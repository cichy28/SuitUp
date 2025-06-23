// frontend/src/components/ProductImageView.tsx
import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, LayoutChangeEvent, ViewStyle } from "react-native";
import { Hotspot } from "shared/validators/hotspot"; // Import typu

interface Props {
	imageUrl: string;
	hotspots: Hotspot[];
	selectedPropertyIds: string[]; // ID właściwości, które zostały już wybrane
	onHotspotPress: (hotspot: Hotspot) => void;
	activeHotspotId?: string;
}

export const ProductImageView = ({
	imageUrl,
	hotspots,
	selectedPropertyIds,
	onHotspotPress,
	activeHotspotId,
}: Props) => {
	const [imageLayout, setImageLayout] = useState<{ width: number; height: number } | null>(null);

	const handleImageLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;
		setImageLayout({ width, height });
	};

	const getHotspotStyle = (hotspot: Hotspot): ViewStyle => {
		if (!imageLayout) return { display: "none" };

		const isSelected = selectedPropertyIds.includes(hotspot.propertyId);
		const isActive = hotspot.id === activeHotspotId;

		return {
			left: hotspot.x * imageLayout.width - 15, // Odejmujemy połowę szerokości, aby wyśrodkować
			top: hotspot.y * imageLayout.height - 15, // Odejmujemy połowę wysokości
			backgroundColor: isSelected ? "#3498db" : "#888888", // Niebieski dla wybranego, szary dla niewybranego
			borderColor: isActive ? "#3498db" : "transparent", // Dodatkowa ramka dla aktywnego
		};
	};

	return (
		<View style={styles.container}>
			<Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" onLayout={handleImageLayout} />
			{imageLayout &&
				hotspots.map((hotspot) => (
					<TouchableOpacity
						key={hotspot.id}
						style={[styles.hotspot, getHotspotStyle(hotspot)]}
						onPress={() => onHotspotPress(hotspot)}
					/>
				))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	hotspot: {
		position: "absolute",
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 2,
		justifyContent: "center",
		alignItems: "center",
	},
});
