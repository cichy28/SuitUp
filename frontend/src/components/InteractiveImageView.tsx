import React, { useState, useMemo, useEffect } from "react";
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

interface InteractiveImageViewProps {
	source: ImageSourcePropType;
	hotspots: HotspotData[];
	onHotspotPress: (hotspot: HotspotData) => void;
}

const InteractiveImageView: React.FC<InteractiveImageViewProps> = ({ source, hotspots, onHotspotPress }) => {
	const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number>(1);

    useEffect(() => {
        if (typeof source === 'number') { // Local image
            const asset = Image.resolveAssetSource(source);
            if (asset) {
                setAspectRatio(asset.width / asset.height);
            }
        } else if (source.uri) { // Remote image
            Image.getSize(source.uri, (width, height) => {
                setAspectRatio(width / height);
            }, (error) => {
                console.error(`Failed to get size for image: ${source.uri}`, error);
                setAspectRatio(1); // Fallback to a default aspect ratio
            });
        }
    }, [source]);

	const imageBox = useMemo(() => {
		if (!containerLayout || !aspectRatio) {
			return null;
		}
		const { width: containerWidth, height: containerHeight } = containerLayout;
		const containerRatio = containerWidth / containerHeight;

		let actualImageWidth: number;
		let actualImageHeight: number;

		if (aspectRatio > containerRatio) {
			actualImageWidth = containerWidth;
			actualImageHeight = containerWidth / aspectRatio;
		} else {
			actualImageHeight = containerHeight;
			actualImageWidth = containerHeight * aspectRatio;
		}

		const actualOffsetX = (containerWidth - actualImageWidth) / 2;
		const actualOffsetY = (containerHeight - actualImageHeight) / 2;

		return { 
			width: actualImageWidth, 
			height: actualImageHeight, 
			left: actualOffsetX, 
			top: actualOffsetY, 
			containerWidth, 
			containerHeight 
		};
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
							resizeMode: "contain",
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
		fontWeight: '700',
		fontSize: 16,
		lineHeight: 18,
	},
	hotspotImage: {
		width: "100%",
		height: "100%",
		borderRadius: 12,
	},
});

export default InteractiveImageView;