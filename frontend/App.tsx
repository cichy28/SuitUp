import React from "react";
import { DesignProvider } from "./src/context/DesignContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
	return (
		<DesignProvider>
			<AppNavigator />
		</DesignProvider>
	);
}
