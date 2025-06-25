import { useState, useEffect } from "react";
import { Product } from "../../../shared/validators/product";
import { BodyShape, StylePreference } from "../../../shared/enums";

const API_URL = "https://your-api-endpoint.com/api"; // Zastąp prawdziwym URL

export function useGetRecommendedProducts(bodyShape: BodyShape | null, styles: StylePreference[]) {
	const [data, setData] = useState<Product[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!bodyShape || styles.length === 0) {
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			setLoading(true);
			try {
				const params = new URLSearchParams({
					bodyShape: bodyShape,
					styles: styles.join(","),
				});
				const response = await fetch(`${API_URL}/recommendations?${params.toString()}`);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const result = await response.json();
				setData(result);
			} catch (e) {
				setError(e as Error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [bodyShape, styles]);

	return { data, loading, error };
}
