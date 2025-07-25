// In: frontend/src/screens/RecommendationScreen.tsx

import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { useGetRecommendedProducts } from "../hooks/useApi";
import { Product } from "shared/validators/product";
import { ThemedView } from "../components/ThemedView";
import { PriceView } from "../components/PriceView";
import { RootStackParamList } from "../navigation/AppNavigator";

type RecommendationScreenRouteProp = RouteProp<RootStackParamList, "Recommendation">;
type RecommendationScreenNavigationProp = StackNavigationProp<RootStackParamList, "Recommendation">;

interface Props {
	route: RecommendationScreenRouteProp;
	navigation: RecommendationScreenNavigationProp;
}

export default function RecommendationScreen({ route }: Props) {
	const { bodyShape, selectedStyles } = route.params || {};
	const { data: products, loading, error } = useGetRecommendedProducts(bodyShape, selectedStyles);

	const navigation = useNavigation<RecommendationScreenNavigationProp>();

	if (loading) {
		return (
			<View style={styles.centeredContainer}>
				<ActivityIndicator size="large" />
				<Text>Ładowanie rekomendacji...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centeredContainer}>
				<Text>Wystąpił błąd: {error.message}</Text>
			</View>
		);
	}

	const renderItem = ({ item }: { item: Product }) => {
		return (
			<TouchableOpacity
				style={styles.card}
				onPress={() => navigation.navigate("ProductConfigurator", { productId: item.id })}
			>
				<Image source={{ uri: item.mainImage?.url || "https://placehold.co/400x600" }} style={styles.image} />
				<View style={styles.textContainer}>
					<Text style={styles.title}>{item.name}</Text>
					{item.skus && item.skus.length > 0 && (
						<PriceView
							skuBasePrice={item.skus[0].skuBasePrice || 0}
							finalPrice={item.skus[0].finalPrice || 0}
							priceMultiplier={item.skus[0].priceMultiplier || 1}
						/>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<ThemedView style={styles.container}>
			<FlatList
				data={products}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				numColumns={2}
				contentContainerStyle={styles.list}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	centeredContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	container: {
		flex: 1,
		backgroundColor: "#F7F5F3",
	},
	list: {
		paddingHorizontal: 8,
		paddingTop: 16,
	},
	card: {
		margin: 8,
		borderRadius: 12,
		backgroundColor: "#fff",
		overflow: "hidden",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		width: 150, // Fixed width
	},
	image: {
		width: 150, // Fixed width
		height: 225, // Fixed height
	},
	textContainer: {
		padding: 12,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
});
