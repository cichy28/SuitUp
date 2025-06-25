import React, { useState, useMemo } from "react";
import { View, Image, TouchableOpacity, StyleSheet, LayoutChangeEvent, ImageSourcePropType, Text } from "react-native";

/**
 * Definicja danych dla pojedynczego hotspota.
 * Jest elastyczna, aby w przyszłości wspierać różne typy hotspotów.
 */
export interface HotspotData {
	id: string | number;
	name: string; // Nazwa logiki (np. "Shoulder", "Sleeve type")
	value: any; // Aktualnie wybrana/zmierzona wartość
	relativeTop: number; // Pozycja Y (0-1)
	relativeLeft: number; // Pozycja X (0-1)

	// Opcjonalne właściwości do customizacji wyglądu hotspota
	displayType?: "text" | "image";
	displayText?: string;
	displayImage?: ImageSourcePropType;
}

export const initialHotspots: HotspotData[] = [
	{ id: 1, name: "Ramiona", value: "", relativeTop: 0.2, relativeLeft: 0.3, displayType: "text", displayText: "+" },
	{
		id: 2,
		name: "Klatka piersiowa",
		value: "",
		relativeTop: 0.4,
		relativeLeft: 0.5,
		displayType: "text",
		displayText: "+",
	},
	{ id: 3, name: "Rękaw", value: "", relativeTop: 0.6, relativeLeft: 0.2, displayType: "text", displayText: "+" },
	// Dodaj więcej hotspotów zgodnie z potrzebami
];

interface InteractiveImageViewProps {
	source: ImageSourcePropType;
	aspectRatio: number;
	hotspots: HotspotData[];
	onHotspotPress: (hotspot: HotspotData) => void;
}

const InteractiveImageView: React.FC<InteractiveImageViewProps> = ({
	source,
	aspectRatio,
	hotspots,
	onHotspotPress,
}) => {
	const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);

	// Ta sama logika obliczająca wymiary i pozycję obrazka, którą mieliśmy wcześniej
	const imageBox = useMemo(() => {
		if (!containerLayout || !aspectRatio) {
			return null;
		}
		const { width: containerWidth, height: containerHeight } = containerLayout;
		const containerRatio = containerWidth / containerHeight;
		let renderedWidth: number;
		let renderedHeight: number;

		if (aspectRatio > containerRatio) {
			renderedWidth = containerWidth;
			renderedHeight = containerWidth / aspectRatio;
		} else {
			renderedHeight = containerHeight;
			renderedWidth = containerHeight * aspectRatio;
		}

		const offsetX = (containerWidth - renderedWidth) / 2;
		const offsetY = (containerHeight - renderedHeight) / 2;

		return { width: renderedWidth, height: renderedHeight, left: offsetX, top: offsetY };
	}, [containerLayout, aspectRatio]);

	return (
		<View style={styles.container} onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}>
			{imageBox && (
				<>
					<Image
						source={source}
						style={{
							position: "absolute",
							width: imageBox.width,
							height: imageBox.height,
							top: imageBox.top,
							left: imageBox.left,
						}}
					/>
					{hotspots.map((hotspot) => {
						const hotspotStyle = {
							position: "absolute",
							top: hotspot.relativeTop * imageBox.height + imageBox.top,
							left: hotspot.relativeLeft * imageBox.width + imageBox.left,
						};

						// Logika wyboru wyglądu hotspota
						let hotspotContent;
						if (hotspot.displayType === "image" && hotspot.displayImage) {
							hotspotContent = <Image source={hotspot.displayImage} style={styles.hotspotImage} />;
						} else if (hotspot.displayType === "text" && hotspot.displayText) {
							hotspotContent = <Text style={styles.hotspotText}>{hotspot.displayText}</Text>;
						} else {
							// Domyślny wygląd
							hotspotContent = <Text style={styles.hotspotText}>+</Text>;
						}

						return (
							<TouchableOpacity
								key={hotspot.id}
								style={[styles.hotspot, hotspotStyle]}
								onPress={() => onHotspotPress(hotspot)}
							>
								{hotspotContent}
							</TouchableOpacity>
						);
					})}
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		position: "relative",
	},
	hotspot: {
		position: "absolute",
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "rgba(211, 47, 47, 0.8)",
		justifyContent: "center",
		alignItems: "center",
		transform: [{ translateX: -12 }, { translateY: -12 }],
	},
	hotspotText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		lineHeight: 18, // dla lepszego wyrównania tekstu w pionie
	},
	hotspotImage: {
		width: "100%",
		height: "100%",
		borderRadius: 12,
	},
});

export default InteractiveImageView;
