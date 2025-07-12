// In: frontend/src/utils/api.ts
import axios from "axios";
import { Product } from "../../../shared/validators/product";

import { Order } from "../../../shared/validators/order";

const API_URL = process.env.EXPO_PUBLIC_API_URL + "/api";

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getProductDetails = async (productId: string): Promise<Product> => {
	const response = await api.get(`/products/${productId}`);
	return response.data;
};

export const placeOrder = async (orderData: any): Promise<Order> => {
	try {
		const response = await api.post("/orders/place", orderData);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.message);
		}
		throw new Error("An unknown error occurred");
	}
};
