import React, { useState, useMemo } from "react";
import { View, Image, TouchableOpacity, StyleSheet, LayoutChangeEvent, ImageSourcePropType, Text } from "react-native";

export interface HotspotData {
	id: string | number;
	name: string;
	value: any;
	relativeTop: number;
	relativeLeft: number;
	displayType?: "text" | "image";
	displayText?: string;
	displayImage?: ImageSourcePropType;
}

interface HotspotImageViewProps {
	source: ImageSourcePropType;
	aspectRatio: number;
	hotspots: HotspotData[];
	onHotspotPress: (hotspot: HotspotData) => void;
}

const HotspotImageView: React.FC<HotspotImageViewProps> = ({ source, aspectRatio, hotspots, onHotspotPress }) => {
	const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);

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

						let hotspotContent;
						if (hotspot.displayType === "image" && hotspot.displayImage) {
							hotspotContent = <Image source={hotspot.displayImage} style={styles.hotspotImage} />;
						} else if (hotspot.displayType === "text" && hotspot.displayText) {
							hotspotContent = <Text style={styles.hotspotText}>{hotspot.displayText}</Text>;
						} else {
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
		lineHeight: 18,
	},
	hotspotImage: {
		width: "100%",
		height: "100%",
		borderRadius: 12,
	},
});

export default HotspotImageView;