import React from "react";
import { View, ImageBackground, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Hotspot, SelectedVariants } from "../types/models";

interface Props {
	/** Obiekt produktu zawierający obrazek bazowy i listę hotspotów */
	productImage: any; // np. require('../../assets/blazer-base.jpg')
	/** Lista hotspotów do wyświetlenia na obrazku */
	hotspots: Hotspot[];
	/** ID aktualnie aktywnej/wybranej właściwości do podświetlenia kropki */
	activePropertyId: string | null;
	/** Obiekt przechowujący wybrane warianty dla każdej właściwości */
	selectedVariants: SelectedVariants;
	/** Funkcja zwrotna wywoływana po naciśnięciu kropki. Przekazuje ID powiązanej właściwości. */
	onHotspotPress: (propertyId: string) => void;
}

const ProductConfiguratorView = ({
	productImage,
	hotspots,
	activePropertyId,
	selectedVariants,
	onHotspotPress,
}: Props) => {
	return (
		<View style={styles.container}>
			<ImageBackground source={productImage} style={styles.image} resizeMode="contain">
				{hotspots.map((hotspot) => {
					const isActive = hotspot.propertyId === activePropertyId;
					const isCompleted = !!selectedVariants[hotspot.propertyId];

					return (
						<TouchableOpacity
							key={hotspot.propertyId}
							style={[
								styles.hotspotBase,
								{
									left: `${hotspot.x}%`,
									top: `${hotspot.y}%`,
								},
								// Jeśli kropka jest "aktywna", pokazujemy specjalne obramowanie
								isActive && styles.hotspotActive,
							]}
							onPress={() => onHotspotPress(hotspot.propertyId)}
						>
							{/* Wewnętrzna kropka zmienia kolor, jeśli wariant został już wybrany */}
							<View style={[styles.hotspotInner, isCompleted && styles.hotspotCompleted]} />
						</TouchableOpacity>
					);
				})}
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		aspectRatio: 1, // Utrzymuje kwadratowe proporcje, dostosuj wg potrzeb
	},
	image: {
		width: "100%",
		height: "100%",
	},
	hotspotBase: {
		position: "absolute",
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		// Przesunięcie, aby środek kropki był w punkcie (x, y)
		transform: [{ translateX: -16 }, { translateY: -16 }],
	},
	hotspotActive: {
		borderWidth: 2,
		borderColor: "#82D4D4", // Kolor turkusowy
		borderStyle: "dashed",
	},
	hotspotInner: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: "#82D4D4", // Domyślny kolor turkusowy
	},
	hotspotCompleted: {
		backgroundColor: "#C88F54", // Kolor brązowy dla "wypełnionej" kropki
	},
});

export default ProductConfiguratorView;
