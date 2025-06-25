import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/AppNavigator";
import { useGetRecommendedProducts } from "@/hooks/useApi";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/Styles";

type RecommendationScreenRouteProp = RouteProp<RootStackParamList, "Recommendation">;

const RecommendationScreen = () => {
	const route = useRoute<RecommendationScreenRouteProp>();
	const { bodyShape, selectedStyles } = route.params;

	const { data: products, loading, error } = useGetRecommendedProducts(bodyShape, selectedStyles);

	if (loading) {
		return <ActivityIndicator size="large" style={styles.centered} />;
	}

	if (error) {
		return (
			<ThemedView style={styles.centered}>
				<ThemedText>Error: {error.message}</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle" style={styles.header}>
				RECOMMENDED FOR YOU
			</ThemedText>
			<FlatList
				data={products}
				numColumns={2}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.card}>
						<Image source={{ uri: item.mainImage?.url || "https://placehold.co/400x600" }} style={styles.image} />
					</TouchableOpacity>
				)}
				contentContainerStyle={styles.list}
			/>
		</ThemedView>
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
		backgroundColor: "#F5F5F5",
	},
	header: {
		textAlign: "center",
		marginVertical: Spacing.large,
		letterSpacing: 1.5,
	},
	list: {
		paddingHorizontal: Spacing.small,
	},
	card: {
		flex: 1,
		margin: Spacing.small,
		aspectRatio: 2 / 3, // Proporcje karty zbliżone do obrazka
		backgroundColor: "white",
		borderRadius: 8,
		overflow: "hidden",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	image: {
		width: "100%",
		height: "100%",
	},
});

export default RecommendationScreen;
