import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "http://localhost:3000/api";

// Główny obiekt API
export const api = axios.create({
	baseURL: API_URL,
});

// Konfiguracja interceptora dla tokenów autoryzacyjnych
api.interceptors.request.use(
	async (config) => {
		const token = await AsyncStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// API dla autoryzacji
export const authAPI = {
	// Logowanie użytkownika
	login: async (email: string, password: string) => {
		try {
			const response = await api.post("/auth/login", { email, password });
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Rejestracja użytkownika
	register: async (email: string, password: string, name: string, userType: string = "client") => {
		try {
			const response = await api.post("/auth/register", { email, password, name, userType });
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie profilu użytkownika
	getProfile: async () => {
		try {
			const response = await api.get("/auth/profile");
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};

// API dla użytkowników (klientów)
export const userAPI = {
	// Zapisywanie wymiarów ciała
	saveBodyMeasurements: async (measurements: any) => {
		try {
			const response = await api.post("/users/measurements", measurements);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie wymiarów ciała
	getBodyMeasurements: async () => {
		try {
			const response = await api.get("/users/measurements");
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Tworzenie zamówienia
	createOrder: async (orderData: any) => {
		try {
			const response = await api.post("/users/orders", orderData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie zamówień użytkownika
	getOrders: async () => {
		try {
			const response = await api.get("/users/orders");
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie szczegółów zamówienia
	getOrderDetails: async (orderId: string) => {
		try {
			const response = await api.get(`/users/orders/${orderId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};

// API dla produktów (dostępne dla wszystkich)
export const productAPI = {
	// Pobieranie listy produktów
	getProducts: async (category?: string) => {
		try {
			const url = category ? `/products?category=${category}` : "/products";
			const response = await api.get(url);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie szczegółów produktu
	getProductDetails: async (productId: string) => {
		try {
			const response = await api.get(`/products/${productId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};

// API dla producentów
export const producerAPI = {
	// Pobieranie produktów producenta
	getProducerProducts: async () => {
		try {
			const response = await api.get("/producer/products");
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie szczegółów produktu producenta
	getProducerProductDetails: async (productId: string) => {
		try {
			const response = await api.get(`/producer/products/${productId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Tworzenie nowego produktu
	createProduct: async (productData: any) => {
		try {
			const response = await api.post("/producer/products", productData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Aktualizacja produktu
	updateProduct: async (productId: string, productData: any) => {
		try {
			const response = await api.put(`/producer/products/${productId}`, productData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Usuwanie produktu
	deleteProduct: async (productId: string) => {
		try {
			const response = await api.delete(`/producer/products/${productId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// NOWE FUNKCJE - Zarządzanie właściwościami produktu

	// Pobieranie właściwości producenta (styles, materials, finishes)
	getProperties: async (type: "styles" | "materials" | "finishes") => {
		try {
			const response = await api.get(`/producer/${type}`);
			return response;
		} catch (error) {
			throw error;
		}
	},

	// Dodawanie nowej właściwości
	addProperty: async (type: "styles" | "materials" | "finishes", propertyData: any) => {
		try {
			const response = await api.post(`/producer/${type}`, propertyData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Generowanie wariantów produktu
	generateVariants: async (productId: string, variantData: any) => {
		try {
			const response = await api.post(`/producer/products/${productId}/variants/generate`, variantData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie wariantów produktu
	getVariants: async (productId: string) => {
		try {
			const response = await api.get(`/producer/products/${productId}/variants`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Aktualizacja obrazka wariantu
	updateVariantImage: async (variantId: string, viewType: string, imageUrl: string) => {
		try {
			const response = await api.put(`/producer/variants/${variantId}/images`, {
				viewType,
				imageUrl,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// STARE FUNKCJE - zachowane dla kompatybilności wstecznej (przestarzałe)

	// Dodawanie stylu do produktu (przestarzałe)
	addProductStyle: async (productId: string, styleData: any) => {
		try {
			const response = await api.post(`/producer/products/${productId}/styles`, styleData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Dodawanie materiału do produktu (przestarzałe)
	addProductMaterial: async (productId: string, materialData: any) => {
		try {
			const response = await api.post(`/producer/products/${productId}/materials`, materialData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Dodawanie wykończenia do produktu (przestarzałe)
	addProductFinish: async (productId: string, finishData: any) => {
		try {
			const response = await api.post(`/producer/products/${productId}/finishes`, finishData);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie zamówień dla produktów producenta
	getProducerOrders: async () => {
		try {
			const response = await api.get("/producer/orders");
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Aktualizacja statusu zamówienia
	updateOrderStatus: async (orderId: string, status: string) => {
		try {
			const response = await api.put(`/producer/orders/${orderId}/status`, { status });
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};


// API dla zarządzania plikami
export const filesAPI = {
	// Upload pliku
	uploadFile: async (file: any, folder?: string) => {
		try {
			const formData = new FormData();
			formData.append('file', file);
			if (folder) {
				formData.append('folder', folder);
			}

			const response = await api.post('/files/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Pobieranie listy plików i folderów
	getFiles: async (folder?: string) => {
		try {
			const params = folder ? { folder } : {};
			const response = await api.get('/files', { params });
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Usuwanie pliku
	deleteFile: async (filename: string, folder?: string) => {
		try {
			const params = folder ? { folder } : {};
			const response = await api.delete(`/files/file/${filename}`, { params });
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Tworzenie folderu
	createFolder: async (folderName: string, parentFolder?: string) => {
		try {
			const response = await api.post('/files/folder', {
				folderName,
				parentFolder: parentFolder || '',
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	// Usuwanie folderu
	deleteFolder: async (folderName: string, parentFolder?: string) => {
		try {
			const params = parentFolder ? { parentFolder } : {};
			const response = await api.delete(`/files/folder/${folderName}`, { params });
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};

