import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HotspotData } from "@/components/InteractiveImageView"; // Zaimportuj typ

// Importowanie ekranów
import LoadingScreen from "../screens/LoadingScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import BriefScreen from "../screens/BriefScreen";
import RecommendationScreen from "../screens/RecommendationScreen";
import ProductConfiguratorView from "../screens/ProductConfiguratorView";
import MeasurementScreen from "../screens/MeasurementScreen";
import SummaryScreen from "../screens/SummaryScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import StylePreferencesScreen from "../screens/StylePreferencesScreen";

// Definicja typów dla parametrów nawigacji
export type RootStackParamList = {
	Loading: undefined;
	Welcome: undefined;
	Brief: undefined;
	StylePreferences: { measurements: HotspotData[] }; // Dodanie nowego ekranu z parametrami
	Recommendation: undefined;
	Configurator: { productId: string };
	Measurement: undefined;
	Summary: undefined;
	Confirmation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Loading" component={LoadingScreen} />
			<Stack.Screen name="Welcome" component={WelcomeScreen} />
			<Stack.Screen name="Brief" component={BriefScreen} />
			<Stack.Screen name="StylePreferences" component={StylePreferencesScreen} />
			<Stack.Screen name="Recommendation" component={RecommendationScreen} />
			<Stack.Screen name="Configurator" component={ProductConfiguratorView} />
			<Stack.Screen name="Measurement" component={MeasurementScreen} />
			<Stack.Screen name="Summary" component={SummaryScreen} />
			<Stack.Screen name="Confirmation" component={ConfirmationScreen} />
		</Stack.Navigator>
	);
}
