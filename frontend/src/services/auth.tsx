import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../services/api";

interface User {
	id: string;
	email: string;
	name?: string;
	userType?: string;
}

interface AuthContextData {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, name: string, isProducer?: boolean) => Promise<void>;
	signOut: () => Promise<void>;
	isAuthenticated: boolean;
	isProducer: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isProducer, setIsProducer] = useState(false);

	useEffect(() => {
		async function loadStorageData() {
			const storedUser = await AsyncStorage.getItem("user");
			const storedToken = await AsyncStorage.getItem("token");

			if (storedUser && storedToken) {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				setIsProducer(parsedUser.userType === "producer");
			}

			setLoading(false);
		}

		loadStorageData();
	}, []);

	const signIn = async (email: string, password: string) => {
		try {
			const response = await authAPI.login(email, password);

			const { user, token } = response;

			await AsyncStorage.setItem("user", JSON.stringify(user));
			await AsyncStorage.setItem("token", token);

			setUser(user);
			setIsProducer(user.userType === "producer");
		} catch (error) {
			throw error;
		}
	};

	const signUp = async (email: string, password: string, name: string, isProducer: boolean = false) => {
		try {
			const userType = isProducer ? "producer" : "client";
			const response = await authAPI.register(email, password, name, userType);

			const { user, token } = response;

			await AsyncStorage.setItem("user", JSON.stringify(user));
			await AsyncStorage.setItem("token", token);

			setUser(user);
			setIsProducer(user.userType === "producer");
		} catch (error) {
			throw error;
		}
	};

	const signOut = async () => {
		await AsyncStorage.removeItem("user");
		await AsyncStorage.removeItem("token");
		setUser(null);
		setIsProducer(false);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				signIn,
				signUp,
				signOut,
				isAuthenticated: !!user,
				isProducer,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export function useAuth(): AuthContextData {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
}
