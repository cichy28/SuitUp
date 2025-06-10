import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:3000/api';

// Konfiguracja interceptora dla tokenów autoryzacyjnych
axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
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
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rejestracja użytkownika
  register: async (email: string, password: string, name: string, userType: string = 'client') => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password, name, userType });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobieranie profilu użytkownika
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// API dla użytkowników (klientów)
export const userAPI = {
  // Zapisywanie wymiarów ciała
  saveBodyMeasurements: async (measurements: any) => {
    try {
      const response = await axios.post(`${API_URL}/users/measurements`, measurements);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobieranie wymiarów ciała
  getBodyMeasurements: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/measurements`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tworzenie zamówienia
  createOrder: async (orderData: any) => {
    try {
      const response = await axios.post(`${API_URL}/users/orders`, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobieranie zamówień użytkownika
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/orders`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobieranie szczegółów zamówienia
  getOrderDetails: async (orderId: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// API dla produktów (dostępne dla wszystkich)
export const productAPI = {
  // Pobieranie listy produktów
  getProducts: async (category?: string) => {
    try {
      const url = category 
        ? `${API_URL}/products?category=${category}` 
        : `${API_URL}/products`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobieranie szczegółów produktu
  getProductDetails: async (productId: string) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// API dla producentów
export const producerAPI = {
  // Pobieranie produktów producenta
  getProducerProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/producer/products`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobieranie szczegółów produktu producenta
  getProducerProductDetails: async (productId: string) => {
    try {
      const response = await axios.get(`${API_URL}/producer/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tworzenie nowego produktu
  createProduct: async (productData: any) => {
    try {
      const response = await axios.post(`${API_URL}/producer/products`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Aktualizacja produktu
  updateProduct: async (productId: string, productData: any) => {
    try {
      const response = await axios.put(`${API_URL}/producer/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Usuwanie produktu
  deleteProduct: async (productId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/producer/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dodawanie stylu do produktu
  addProductStyle: async (productId: string, styleData: any) => {
    try {
      const response = await axios.post(`${API_URL}/producer/products/${productId}/styles`, styleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dodawanie materiału do produktu
  addProductMaterial: async (productId: string, materialData: any) => {
    try {
      const response = await axios.post(`${API_URL}/producer/products/${productId}/materials`, materialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dodawanie wykończenia do produktu
  addProductFinish: async (productId: string, finishData: any) => {
    try {
      const response = await axios.post(`${API_URL}/producer/products/${productId}/finishes`, finishData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pobieranie zamówień dla produktów producenta
  getProducerOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/producer/orders`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Aktualizacja statusu zamówienia
  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      const response = await axios.put(`${API_URL}/producer/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
