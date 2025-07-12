import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HotspotData } from "@/components/InteractiveImageView";
import LoadingScreen from "../screens/LoadingScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import BriefScreen from "../screens/BriefScreen";
import RecommendationScreen from "../screens/RecommendationScreen";
import ProductConfiguratorScreen from "../screens/ProductConfiguratorScreen"; // Zmiana importu
import MeasurementScreen from "../screens/MeasurementScreen";
import SummaryScreen from "../screens/SummaryScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import StylePreferencesScreen from "../screens/StylePreferencesScreen";
import { BodyShape, StylePreference } from "../../../shared/enums";
import { Order } from "../../../shared/validators/order";
import { Product } from "../../../shared/validators/product";

export type RootStackParamList = {
	Loading: undefined;
	Welcome: undefined;
	Brief: undefined;
	StylePreferences: { measurements: HotspotData[] };
	Recommendation: { bodyShape: BodyShape | null; selectedStyles: StylePreference[] };
	ProductConfigurator: { productId: string };
	Measurement: undefined;
	Summary: { product: Product; selectedVariants: Record<string, string> };
	Confirmation: { order: Order };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Loading" component={LoadingScreen} />
			<Stack.Screen name="Welcome" component={WelcomeScreen} />
			<Stack.Screen name="Brief" component={BriefScreen} />
			<Stack.Screen name="StylePreferences" component={StylePreferencesScreen} options={{ headerShown: true, title: 'Preferencje Stylu' }} />
			<Stack.Screen name="Recommendation" component={RecommendationScreen} options={{ headerShown: true, title: 'Rekomendacje' }} />
			<Stack.Screen
				name="ProductConfigurator"
				component={ProductConfiguratorScreen} // Poprawiony komponent
				options={{ headerShown: true, title: "Konfiguruj Produkt" }}
			/>
			<Stack.Screen name="Measurement" component={MeasurementScreen} />
			<Stack.Screen name="Summary" component={SummaryScreen} options={{ headerShown: true, title: 'Podsumowanie' }} />
			<Stack.Screen name="Confirmation" component={ConfirmationScreen} />
		</Stack.Navigator>
	);
}
