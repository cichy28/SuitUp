// In: frontend/src/hooks/useApi.ts

import useSWR from "swr";
import { api } from "../utils/api";
import { Product } from "shared/validators/product";
import { BodyShape, StylePreference } from "shared/enums";

type FullProduct = Product & {
	hotspots: any[];
	mainImage: any;
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

/**
 * Hook do pobierania rekomendowanych produktów.
 */
export function useGetRecommendedProducts(bodyShape: BodyShape | null, selectedStyles?: StylePreference[]) {
	const params = new URLSearchParams();
	if (bodyShape) {
		params.append("bodyShape", bodyShape);
	}

	if (selectedStyles && selectedStyles.length > 0) {
		// --- POPRAWKA TUTAJ ---
		// Zmieniamy 'style' na 'styles', aby pasowało do walidatora na backendzie.
		selectedStyles.forEach((style) => params.append("styles", style));
		// --------------------
	}

	const shouldFetch = selectedStyles && selectedStyles.length > 0;
	const { data, error } = useSWR<Product[]>(shouldFetch ? `/recommendations?${params.toString()}` : null, fetcher);

	return {
		data,
		loading: shouldFetch && !error && !data,
		error,
	};
}

/**
 * Hook do pobierania szczegółowych danych pojedynczego produktu po jego ID.
 */
export function useGetProductById(productId?: string) {
	const { data, error } = useSWR<FullProduct>(productId ? `/products/${productId}` : null, fetcher);

	return {
		data,
		loading: !error && !data && !!productId,
		error,
	};
}
