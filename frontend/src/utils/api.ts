// In: frontend/src/utils/api.ts
import axios from "axios";
import { Product } from "../../../shared/validators/product";

const API_URL = "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProductDetails = async (productId: string): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};


