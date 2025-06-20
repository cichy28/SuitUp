import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { DesignProvider } from "./src/context/DesignContext";

// --- POCZĄTEK ZMIANY ---
// Importujemy brakujący SafeAreaProvider
import { SafeAreaProvider } from "react-native-safe-area-context";
// --- KONIEC ZMIANY ---

const App = () => {
	return (
		// --- POCZĄTEK ZMIANY ---
		// Opakowujemy całą aplikację w SafeAreaProvider
		<SafeAreaProvider>
			<NavigationContainer>
				<DesignProvider>
					<AppNavigator />
				</DesignProvider>
			</NavigationContainer>
		</SafeAreaProvider>
		// --- KONIEC ZMIANY ---
	);
};

export default App;
