// In: frontend/src/screens/ProductConfiguratorView.tsx

import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from "react-native";
import { api } from "../utils/api"; // Poprawny import instancji api
import { RootStackParamList } from "../navigation/AppNavigator"; // Poprawny import typów nawigacji
import { Product } from "../../../shared/validators/product"; // Poprawny import typu Product

type ProductConfiguratorViewRouteProp = RouteProp<RootStackParamList, "ProductConfigurator">;

const ProductConfiguratorView = () => {
	const route = useRoute<ProductConfiguratorViewRouteProp>();
	const { productId } = route.params;
	const [product, setProduct] = useState<Product | null>(null); // Użycie typu Product
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				// Użycie instancji api do wysłania zapytania GET
				const response = await api.get(`/products/${productId}`);
				setProduct(response.data);
			} catch (e: any) {
				setError(e.response?.data?.message || e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [productId]);

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>Error: {error}</Text>
			</View>
		);
	}

	if (!product) {
		return (
			<View style={styles.centered}>
				<Text>No product found.</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>{product.name}</Text>
			{/* Sprawdzenie, czy mainImage istnieje, zanim spróbujemy uzyskać dostęp do jego właściwości */}
			{product.mainImage && <Image source={{ uri: product.mainImage.url }} style={styles.image} />}
			<Text style={styles.price}>Base Price: ${product.basePrice}</Text>

			{product.properties && product.properties.length > 0 ? (
				product.properties.map((property, index) => (
					<View key={index} style={styles.propertyContainer}>
						<Text style={styles.propertyTitle}>{property.property.name}</Text>
						{/* Dalej można mapować property.property.propertyVariants, jeśli istnieją */}
					</View>
				))
			) : (
				<Text>No configurable properties for this product.</Text>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	image: {
		width: "100%",
		height: 300,
		marginBottom: 16,
	},
	price: {
		fontSize: 18,
		marginBottom: 16,
	},
	propertyContainer: {
		marginBottom: 16,
	},
	propertyTitle: {
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default ProductConfiguratorView;
