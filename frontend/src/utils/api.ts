// In: frontend/src/utils/api.ts

import axios from "axios";

// Adres URL Twojego lokalnego serwera backendowego.
// Upewnij się, że port (tutaj 3000) jest taki sam, na jakim działa Twój backend.
const API_URL = "http://localhost:3000/api";

// Tworzymy nową instancję axios z domyślną konfiguracją
export const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Możesz tutaj w przyszłości dodać interceptory, np. do automatycznego
 * dołączania tokena autoryzacyjnego do każdego zapytania.
 * * Przykład:
 * api.interceptors.request.use(config => {
 * const token = localStorage.getItem('authToken');
 * if (token) {
 * config.headers.Authorization = `Bearer ${token}`;
 * }
 * return config;
 * });
 */
