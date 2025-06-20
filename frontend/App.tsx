import React from "react";
import { DesignProvider } from "./src/context/DesignContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
	return (
		<DesignProvider>
			<NavigationContainer>
				<AppNavigator />
			</NavigationContainer>
		</DesignProvider>
	);
}
